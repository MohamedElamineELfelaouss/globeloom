// Frontend API service for GlobeLoom backend integration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("globeloom_token");
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

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

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
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
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
      await this.post("/auth/logout", {});
    } finally {
      this.setToken(null);
    }
  }

  async getProfile() {
    return this.get("/auth/profile");
  }
  async updateProfile(profileData) {
    return this.put("/users/profile", profileData);
  }

  // Trip methods
  async getTrips(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/trips/user?${queryString}`);
  }

  async getTripById(tripId) {
    return this.get(`/trips/${tripId}`);
  }

  async createTrip(tripData) {
    return this.post("/trips", tripData);
  }

  async updateTrip(tripId, tripData) {
    return this.put(`/trips/${tripId}`, tripData);
  }

  async deleteTrip(tripId) {
    return this.delete(`/trips/${tripId}`);
  }

  async addActivity(tripId, activityData) {
    return this.post(`/trips/${tripId}/activities`, activityData);
  }

  async updateActivity(tripId, activityId, activityData) {
    return this.put(`/trips/${tripId}/activities/${activityId}`, activityData);
  }

  async deleteActivity(tripId, activityId) {
    return this.delete(`/trips/${tripId}/activities/${activityId}`);
  }

  async addCollaborator(tripId, userId) {
    return this.post(`/trips/${tripId}/collaborators`, { userId });
  }

  async removeCollaborator(tripId, collaboratorId) {
    return this.delete(`/trips/${tripId}/collaborators/${collaboratorId}`);
  }

  // User methods
  async searchUsers(query, params = {}) {
    const queryString = new URLSearchParams({ query, ...params }).toString();
    return this.get(`/users/search?${queryString}`);
  }

  async getUserProfile(userId) {
    return this.get(`/users/${userId}`);
  }

  async followUser(userId) {
    return this.post(`/users/${userId}/follow`);
  }

  async unfollowUser(userId) {
    return this.delete(`/users/${userId}/follow`);
  }

  async getFollowers(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/users/${userId}/followers?${queryString}`);
  }

  async getFollowing(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/users/${userId}/following?${queryString}`);
  }

  async getLeaderboard(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/users/leaderboard?${queryString}`);
  }

  async updatePreferences(preferences) {
    return this.put("/users/preferences", { preferences });
  }
  // Upload methods with base64
  async uploadAvatar(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64String = reader.result;
          const response = await this.put("/profile/avatar", {
            avatar: base64String,
          });
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }
  async uploadBanner(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64String = reader.result;
          const response = await this.put("/profile/banner", {
            banner: base64String,
          });
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }
  // User profile methods
  async updateUserProfile(profileData) {
    return this.put("/users/profile", profileData);
  }

  // Community methods
  async getCommunityFeed(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/community/feed?${queryString}`);
  }

  async createPost(postData) {
    return this.post("/community/posts", postData);
  }

  async getPost(postId) {
    return this.get(`/community/posts/${postId}`);
  }

  async toggleLikePost(postId) {
    return this.post(`/community/posts/${postId}/like`);
  }

  async addComment(postId, content) {
    return this.post(`/community/posts/${postId}/comments`, { content });
  }

  async sharePost(postId, platform = "link") {
    return this.post(`/community/posts/${postId}/share`, { platform });
  }

  async deletePost(postId) {
    return this.delete(`/community/posts/${postId}`);
  }

  async getCommunityStats() {
    return this.get("/community/stats");
  }

  async getTrendingTags(limit = 10) {
    return this.get(`/community/trending-tags?limit=${limit}`);
  }

  async getSuggestedUsers(limit = 5) {
    return this.get(`/community/suggested-users?limit=${limit}`);
  }

  // User profile in community
  async getCommunityUserProfile(userId) {
    return this.get(`/community/users/${userId}`);
  }

  // Bookmark/Save posts
  async toggleBookmarkPost(postId) {
    return this.post(`/community/posts/${postId}/bookmark`);
  }

  async getSavedPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/community/saved?${queryString}`);
  }

  // Health check
  async healthCheck() {
    return this.get("/health");
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
