// Image caching service for GlobeLoom
// Handles both Unsplash API response caching and image data caching

class ImageCacheService {
  constructor() {
    this.API_CACHE_KEY = "globeloom_api_cache";
    this.IMAGE_CACHE_KEY = "globeloom_image_cache";
    this.CACHE_EXPIRY_HOURS = 24; // Cache expires after 24 hours
    this.MAX_CACHE_SIZE = 50; // Maximum number of cached items
  }

  // API Response Caching
  getCachedApiResponse(cacheKey) {
    try {
      const cached = localStorage.getItem(`${this.API_CACHE_KEY}_${cacheKey}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const isExpired =
        Date.now() - timestamp > this.CACHE_EXPIRY_HOURS * 60 * 60 * 1000;

      if (isExpired) {
        localStorage.removeItem(`${this.API_CACHE_KEY}_${cacheKey}`);
        return null;
      }

      console.log(`🎯 Using cached API response for: ${cacheKey}`);
      return data;
    } catch (error) {
      console.warn("Error reading API cache:", error);
      return null;
    }
  }

  setCachedApiResponse(cacheKey, data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        `${this.API_CACHE_KEY}_${cacheKey}`,
        JSON.stringify(cacheData)
      );
      console.log(`💾 Cached API response for: ${cacheKey}`);
    } catch (error) {
      console.warn("Error saving API cache:", error);
      this.clearOldApiCache();
    }
  }

  // Image Data Caching using IndexedDB
  async getCachedImage(imageUrl) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["images"], "readonly");
      const store = transaction.objectStore("images");
      const result = await this.promisifyRequest(store.get(imageUrl));

      if (!result) return null;

      const isExpired =
        Date.now() - result.timestamp >
        this.CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
      if (isExpired) {
        await this.removeCachedImage(imageUrl);
        return null;
      }

      console.log(`🖼️ Using cached image: ${imageUrl.substring(0, 50)}...`);
      return result.blob;
    } catch (error) {
      console.warn("Error reading image cache:", error);
      return null;
    }
  }

  async setCachedImage(imageUrl, blob) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");

      const cacheData = {
        url: imageUrl,
        blob,
        timestamp: Date.now(),
      };

      await this.promisifyRequest(store.put(cacheData));
      console.log(`💾 Cached image: ${imageUrl.substring(0, 50)}...`);

      // Clean up old cache if needed
      await this.cleanupImageCache(db);
    } catch (error) {
      console.warn("Error saving image cache:", error);
    }
  }

  async removeCachedImage(imageUrl) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");
      await this.promisifyRequest(store.delete(imageUrl));
    } catch (error) {
      console.warn("Error removing cached image:", error);
    }
  }

  // IndexedDB helpers
  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("GlobeLoomImageCache", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("images")) {
          const store = db.createObjectStore("images", { keyPath: "url" });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  promisifyRequest(request) {
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async cleanupImageCache(db) {
    try {
      const transaction = db.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");
      const index = store.index("timestamp");
      const allItems = await this.promisifyRequest(index.getAll());

      if (allItems.length > this.MAX_CACHE_SIZE) {
        // Sort by timestamp and remove oldest items
        allItems.sort((a, b) => a.timestamp - b.timestamp);
        const itemsToRemove = allItems.slice(
          0,
          allItems.length - this.MAX_CACHE_SIZE
        );

        for (const item of itemsToRemove) {
          await this.promisifyRequest(store.delete(item.url));
        }
        console.log(`🧹 Cleaned up ${itemsToRemove.length} old cached images`);
      }
    } catch (error) {
      console.warn("Error cleaning up image cache:", error);
    }
  }

  // Utility methods
  clearOldApiCache() {
    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(this.API_CACHE_KEY)
      );
      if (keys.length > this.MAX_CACHE_SIZE) {
        keys.forEach((key) => localStorage.removeItem(key));
        console.log("🧹 Cleared old API cache");
      }
    } catch (error) {
      console.warn("Error clearing API cache:", error);
    }
  }

  async clearAllCache() {
    try {
      // Clear localStorage API cache
      const keys = Object.keys(localStorage).filter(
        (key) =>
          key.startsWith(this.API_CACHE_KEY) ||
          key.startsWith(this.IMAGE_CACHE_KEY)
      );
      keys.forEach((key) => localStorage.removeItem(key));

      // Clear IndexedDB image cache
      const db = await this.openDB();
      const transaction = db.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");
      await this.promisifyRequest(store.clear());

      console.log("🧹 Cleared all image cache");
    } catch (error) {
      console.warn("Error clearing all cache:", error);
    }
  }

  // Enhanced image loading with caching
  async loadImageWithCache(imageUrl, fallbackOptions = {}) {
    try {
      // Check cache first
      const cachedBlob = await this.getCachedImage(imageUrl);
      if (cachedBlob) {
        return this.createImageFromBlob(cachedBlob);
      }

      // If not cached, load from network
      const img = await this.loadImageFromNetwork(imageUrl);

      // Convert to blob and cache
      const blob = await this.imageToBlob(img);
      await this.setCachedImage(imageUrl, blob);

      return img;
    } catch (error) {
      console.warn(`Failed to load image ${imageUrl}:`, error);
      if (fallbackOptions.createFallback) {
        return fallbackOptions.createFallback();
      }
      throw error;
    }
  }

  async loadImageFromNetwork(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      const timeout = setTimeout(() => {
        reject(new Error("Image load timeout"));
      }, 10000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve(img);
      };

      img.onerror = (error) => {
        clearTimeout(timeout);
        reject(error);
      };

      img.src = imageUrl;
    });
  }

  async imageToBlob(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.8);
    });
  }

  createImageFromBlob(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(img);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  // Get cache statistics
  async getCacheStats() {
    try {
      const apiCacheSize = Object.keys(localStorage).filter((key) =>
        key.startsWith(this.API_CACHE_KEY)
      ).length;

      const db = await this.openDB();
      const transaction = db.transaction(["images"], "readonly");
      const store = transaction.objectStore("images");
      const imageCacheSize = await this.promisifyRequest(store.count());

      return {
        apiCacheSize,
        imageCacheSize,
        maxCacheSize: this.MAX_CACHE_SIZE,
      };
    } catch (error) {
      console.warn("Error getting cache stats:", error);
      return {
        apiCacheSize: 0,
        imageCacheSize: 0,
        maxCacheSize: this.MAX_CACHE_SIZE,
      };
    }
  }
}

// Export singleton instance
export const imageCacheService = new ImageCacheService();
export default imageCacheService;
