// Service Discovery Configuration for GlobeLoom
// Handles dynamic backend address resolution and failover

class ServiceDiscovery {
  constructor() {
    this.knownEndpoints = [
      "http://localhost:5000",
      "http://127.0.0.1:5000",
      "http://0.0.0.0:5000",
      // Add production endpoints here when available
      ...(import.meta.env.VITE_BACKEND_ENDPOINTS?.split(",") || []),
    ];

    this.currentEndpoint = null;
    this.lastChecked = null;
    this.checkInterval = 30000; // 30 seconds
    this.healthCheckTimeout = 5000; // 5 seconds
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second

    // Initialize with environment variable or first known endpoint
    this.baseURL = import.meta.env.VITE_API_URL || this.knownEndpoints[0];
    this.apiURL = `${this.baseURL}/api`;

    this.initializeService();
  }

  async initializeService() {
    console.log("🔍 Initializing Service Discovery...");
    await this.discoverAvailableEndpoint();
    this.startHealthChecking();
  }

  // Discover which backend endpoint is available
  async discoverAvailableEndpoint() {
    console.log("🔍 Discovering available backend endpoints...");

    for (const endpoint of this.knownEndpoints) {
      if (await this.isEndpointHealthy(endpoint)) {
        this.setCurrentEndpoint(endpoint);
        console.log(`✅ Connected to backend at: ${endpoint}`);
        return endpoint;
      }
    }

    console.warn("⚠️ No healthy backend endpoints found");
    return null;
  }

  // Check if an endpoint is healthy
  async isEndpointHealthy(endpoint) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.healthCheckTimeout
      );

      const response = await fetch(`${endpoint}/health`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log(`❌ Health check failed for ${endpoint}:`, error.message);
      return false;
    }
  }

  // Set the current active endpoint
  setCurrentEndpoint(endpoint) {
    this.currentEndpoint = endpoint;
    this.baseURL = endpoint;
    this.apiURL = `${endpoint}/api`;
    this.lastChecked = Date.now();

    // Store in localStorage for persistence
    localStorage.setItem("globeloom_backend_endpoint", endpoint);

    // Dispatch event for other parts of the app
    window.dispatchEvent(
      new CustomEvent("backendEndpointChanged", {
        detail: { endpoint, apiURL: this.apiURL },
      })
    );
  }

  // Get current API URL
  getApiURL() {
    // Check if we have a stored endpoint from previous session
    if (!this.currentEndpoint) {
      const stored = localStorage.getItem("globeloom_backend_endpoint");
      if (stored) {
        this.setCurrentEndpoint(stored);
      }
    }

    return this.apiURL;
  }

  // Make a request with automatic failover
  async makeRequest(endpoint, options = {}) {
    let lastError = null;

    // First try with current endpoint
    if (this.currentEndpoint) {
      try {
        return await this.executeRequest(`${this.apiURL}${endpoint}`, options);
      } catch (error) {
        console.warn(
          `Request failed with current endpoint ${this.currentEndpoint}:`,
          error.message
        );
        lastError = error;
      }
    }

    // If current endpoint failed, try discovering a new one
    console.log("🔄 Attempting to discover new backend endpoint...");
    const newEndpoint = await this.discoverAvailableEndpoint();

    if (newEndpoint && newEndpoint !== this.currentEndpoint) {
      try {
        return await this.executeRequest(`${this.apiURL}${endpoint}`, options);
      } catch (error) {
        console.error("Request failed even with new endpoint:", error.message);
        lastError = error;
      }
    }

    // If all endpoints failed, throw the last error
    throw lastError || new Error("No healthy backend endpoints available");
  }

  // Execute a request with retry logic
  async executeRequest(url, options) {
    let lastError = null;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, options);

        // If we get a response, reset any connection issues
        if (response.ok || response.status < 500) {
          return response;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        lastError = error;
        console.warn(`Request attempt ${attempt} failed:`, error.message);

        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw lastError;
  }

  // Start periodic health checking
  startHealthChecking() {
    setInterval(async () => {
      if (
        this.currentEndpoint &&
        !(await this.isEndpointHealthy(this.currentEndpoint))
      ) {
        console.warn(
          `⚠️ Current endpoint ${this.currentEndpoint} became unhealthy`
        );
        await this.discoverAvailableEndpoint();
      }
    }, this.checkInterval);
  }

  // Add a new endpoint to the known list
  addEndpoint(endpoint) {
    if (!this.knownEndpoints.includes(endpoint)) {
      this.knownEndpoints.push(endpoint);
      console.log(`➕ Added new endpoint: ${endpoint}`);
    }
  }

  // Remove an endpoint from the known list
  removeEndpoint(endpoint) {
    this.knownEndpoints = this.knownEndpoints.filter((ep) => ep !== endpoint);
    console.log(`➖ Removed endpoint: ${endpoint}`);
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: !!this.currentEndpoint,
      endpoint: this.currentEndpoint,
      lastChecked: this.lastChecked,
      knownEndpoints: this.knownEndpoints,
    };
  }

  // Utility method for delays
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Create singleton instance
const serviceDiscovery = new ServiceDiscovery();

export default serviceDiscovery;
