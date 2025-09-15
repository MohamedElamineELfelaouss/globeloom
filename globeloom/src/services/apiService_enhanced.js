// Enhanced API Service with Service Discovery for GlobeLoom
import serviceDiscovery from "../config/serviceDiscovery.js";

class ApiService {
  constructor() {
    this.token = localStorage.getItem("globeloom_token");
    this.isOnline = navigator.onLine;
    this.requestQueue = [];
    this.isProcessingQueue = false;

    // Listen for online/offline events
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.processRequestQueue();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
    });

    // Listen for backend endpoint changes
    window.addEventListener("backendEndpointChanged", (event) => {
      console.log("🔄 Backend endpoint changed to:", event.detail.endpoint);
    });
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("globeloom_token", token);
    } else {
      localStorage.removeItem("globeloom_token");
    }
  }

  // Get authentication headers
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Enhanced request method with service discovery
  async request(endpoint, options = {}) {
    // Check if we're online
    if (!this.isOnline) {
      return this.queueRequest(endpoint, options);
    }

    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      console.log(`🌐 Making request to: ${endpoint}`);
      const response = await serviceDiscovery.makeRequest(endpoint, config);

      // Handle different response types
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);

      // If it's a network error and we're online, queue the request
      if (this.isOnline && this.isNetworkError(error)) {
        return this.queueRequest(endpoint, options);
      }

      throw error;
    }
  }

  // Queue requests when offline or when backend is unavailable
  async queueRequest(endpoint, options) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        endpoint,
        options,
        resolve,
        reject,
        timestamp: Date.now(),
      });

      console.log(
        `📝 Queued request: ${endpoint} (${this.requestQueue.length} in queue)`
      );
    });
  }

  // Process queued requests when back online
  async processRequestQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    console.log(`🔄 Processing ${this.requestQueue.length} queued requests...`);

    while (this.requestQueue.length > 0) {
      const queuedRequest = this.requestQueue.shift();

      try {
        const result = await this.request(
          queuedRequest.endpoint,
          queuedRequest.options
        );
        queuedRequest.resolve(result);
      } catch (error) {
        queuedRequest.reject(error);
      }
    }

    this.isProcessingQueue = false;
    console.log("✅ Finished processing queued requests");
  }

  // Check if error is a network error
  isNetworkError(error) {
    return (
      error.message.includes("Failed to fetch") ||
      error.message.includes("Network request failed") ||
      error.message.includes("No healthy backend endpoints")
    );
  }

  // HTTP Methods
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Authentication methods
  async register(userData) {
    return this.post("/auth/register", userData);
  }

  async login(credentials) {
    const response = await this.post("/auth/login", credentials);
    if (response.success && response.data.tokens) {
      this.setToken(response.data.tokens.accessToken);
    }
    return response;
  }

  async logout() {
    try {
      await this.post("/auth/logout");
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      this.setToken(null);
    }
  }

  async refreshToken() {
    try {
      const response = await this.post("/auth/refresh");
      if (response.success && response.data.accessToken) {
        this.setToken(response.data.accessToken);
        return response.data.accessToken;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.setToken(null);
      throw error;
    }
  }

  // User methods
  async getProfile() {
    return this.get("/users/profile");
  }

  async updateProfile(profileData) {
    return this.put("/users/profile", profileData);
  }

  async uploadAvatar(formData) {
    return this.request("/users/avatar", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : undefined,
      },
    });
  }

  // Trip methods
  async getTrips(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/trips${queryString ? `?${queryString}` : ""}`);
  }

  async getTripById(id) {
    return this.get(`/trips/${id}`);
  }

  async createTrip(tripData) {
    return this.post("/trips", tripData);
  }

  async updateTrip(id, tripData) {
    return this.put(`/trips/${id}`, tripData);
  }

  async deleteTrip(id) {
    return this.delete(`/trips/${id}`);
  } // Community methods
  async getCommunityPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/community/feed${queryString ? `?${queryString}` : ""}`);
  }

  // Alias for backward compatibility
  async getCommunityFeed(params = {}) {
    return this.getCommunityPosts(params);
  }

  // Get community statistics
  async getCommunityStats() {
    return this.get("/community/stats");
  }

  async createPost(postData) {
    return this.post("/community/posts", postData);
  }

  async likePost(postId) {
    return this.post(`/community/posts/${postId}/like`);
  }

  async commentOnPost(postId, comment) {
    return this.post(`/community/posts/${postId}/comments`, {
      content: comment,
    });
  }

  async bookmarkPost(postId) {
    return this.post(`/community/posts/${postId}/bookmark`);
  }

  async followUser(userId) {
    return this.post(`/community/users/${userId}/follow`);
  }
  async getBookmarks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/community/saved${queryString ? `?${queryString}` : ""}`);
  }

  async getSuggestedUsers() {
    return this.get("/community/suggested-users");
  }

  async getTrendingTags(limit = 10) {
    return this.get(`/community/trending-tags?limit=${limit}`);
  }

  // Alias for getTrendingTags
  async getTrendingTopics() {
    return this.get("/community/trending-tags");
  }

  async searchPosts(query, params = {}) {
    const searchParams = new URLSearchParams({
      q: query,
      ...params,
    }).toString();
    return this.get(`/community/search?${searchParams}`);
  }

  // Upload methods
  async uploadImage(file, type = "general") {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    return this.request("/upload/image", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : undefined,
      },
    });
  }

  // Additional convenience methods for the Community component
  async toggleLikePost(postId) {
    return this.likePost(postId);
  }

  async addComment(postId, comment) {
    return this.commentOnPost(postId, comment);
  }

  async toggleBookmarkPost(postId) {
    return this.bookmarkPost(postId);
  }

  async toggleFollowUser(userId) {
    return this.followUser(userId);
  }

  // Get connection status
  getConnectionStatus() {
    return {
      ...serviceDiscovery.getConnectionStatus(),
      isOnline: this.isOnline,
      queuedRequests: this.requestQueue.length,
      isProcessingQueue: this.isProcessingQueue,
    };
  }

  // Manually trigger endpoint discovery
  async discoverEndpoint() {
    return serviceDiscovery.discoverAvailableEndpoint();
  }

  // Add custom endpoint
  addEndpoint(endpoint) {
    serviceDiscovery.addEndpoint(endpoint);
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
