const User = require("../models/User");
const Trip = require("../models/Trip");
const { validationResult } = require("express-validator");
const {
  ensureGamification,
  addPoints,
  getTotalPoints,
  updateStats,
} = require("../utils/gamificationHelper");

const userController = {
  // Search users
  async searchUsers(req, res) {
    try {
      const { query, page = 1, limit = 10 } = req.query;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Search query must be at least 2 characters long",
        });
      }

      const searchRegex = new RegExp(query.trim(), "i");
      const searchQuery = {
        $or: [
          { username: searchRegex },
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
        ],
      };

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const users = await User.find(searchQuery)
        .select(
          "username firstName lastName profile.avatar profile.bio profile.location"
        )
        .skip(skip)
        .limit(parseInt(limit));

      const total = await User.countDocuments(searchQuery);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Search users error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get user profile by ID
  async getUserProfile(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.id;

      const user = await User.findById(userId)
        .select("-password -refreshTokens -email")
        .populate("followers", "username firstName lastName profile.avatar")
        .populate("following", "username firstName lastName profile.avatar");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Get user's public trips
      const trips = await Trip.find({
        $or: [
          { creator: userId, privacy: "public" },
          { collaborators: userId, privacy: "public" },
        ],
      })
        .select(
          "title description destination coverImage startDate endDate status"
        )
        .populate("creator", "username firstName lastName profile.avatar")
        .sort({ createdAt: -1 })
        .limit(10);

      // Check if current user follows this user
      const isFollowing = user.followers.some(
        (follower) => follower._id.toString() === currentUserId
      );
      const userProfile = {
        ...user.toObject(),
        isFollowing,
        trips,
        stats: {
          tripsCount: trips.length,
          followersCount: user.followers.length,
          followingCount: user.following.length,
          totalPoints: getTotalPoints(user),
        },
      };

      res.json({
        success: true,
        data: { user: userProfile },
      });
    } catch (error) {
      console.error("Get user profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Follow user
  async followUser(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.id;

      if (userId === currentUserId) {
        return res.status(400).json({
          success: false,
          message: "Cannot follow yourself",
        });
      }

      const [currentUser, targetUser] = await Promise.all([
        User.findById(currentUserId),
        User.findById(userId),
      ]);

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if already following
      if (currentUser.following.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "Already following this user",
        });
      } // Add to following/followers
      currentUser.following.push(userId);
      targetUser.followers.push(currentUserId);

      // Award points for social interaction
      addPoints(currentUser, 5);
      addPoints(targetUser, 3);
      updateStats(currentUser, "follower_gained");

      await Promise.all([currentUser.save(), targetUser.save()]);

      res.json({
        success: true,
        message: "User followed successfully",
      });
    } catch (error) {
      console.error("Follow user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Unfollow user
  async unfollowUser(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.id;

      const [currentUser, targetUser] = await Promise.all([
        User.findById(currentUserId),
        User.findById(userId),
      ]);

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Remove from following/followers
      currentUser.following.pull(userId);
      targetUser.followers.pull(currentUserId);

      await Promise.all([currentUser.save(), targetUser.save()]);

      res.json({
        success: true,
        message: "User unfollowed successfully",
      });
    } catch (error) {
      console.error("Unfollow user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get user's followers
  async getFollowers(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const followers = await User.find({ _id: { $in: user.followers } })
        .select("username firstName lastName profile.avatar profile.bio")
        .skip(skip)
        .limit(parseInt(limit));

      res.json({
        success: true,
        data: {
          followers,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: user.followers.length,
            pages: Math.ceil(user.followers.length / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get followers error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get user's following
  async getFollowing(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const following = await User.find({ _id: { $in: user.following } })
        .select("username firstName lastName profile.avatar profile.bio")
        .skip(skip)
        .limit(parseInt(limit));

      res.json({
        success: true,
        data: {
          following,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: user.following.length,
            pages: Math.ceil(user.following.length / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get following error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Update user preferences
  async updatePreferences(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const userId = req.user.id;
      const { preferences } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update preferences
      if (preferences.currency)
        user.profile.preferences.currency = preferences.currency;
      if (preferences.language)
        user.profile.preferences.language = preferences.language;
      if (preferences.notifications) {
        Object.assign(
          user.profile.preferences.notifications,
          preferences.notifications
        );
      }

      await user.save();

      res.json({
        success: true,
        message: "Preferences updated successfully",
        data: { preferences: user.profile.preferences },
      });
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get user stats and leaderboard
  async getLeaderboard(req, res) {
    try {
      const { page = 1, limit = 50, timeframe = "all" } = req.query;

      let matchCondition = {};

      // Filter by timeframe
      if (timeframe !== "all") {
        const now = new Date();
        let startDate;

        switch (timeframe) {
          case "week":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "month":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "year":
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        }

        if (startDate) {
          matchCondition.createdAt = { $gte: startDate };
        }
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const leaderboard = await User.aggregate([
        { $match: matchCondition },
        {
          $project: {
            username: 1,
            firstName: 1,
            lastName: 1,
            "profile.avatar": 1,
            totalPoints: "$gamification.totalPoints",
            level: "$gamification.level",
            tripsCompleted: "$gamification.achievements.tripsCompleted",
            countriesVisited: "$gamification.achievements.countriesVisited",
          },
        },
        { $sort: { totalPoints: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
      ]);

      const total = await User.countDocuments(matchCondition);

      res.json({
        success: true,
        data: {
          leaderboard,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { displayName, bio, location } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      } // Update profile fields
      if (displayName !== undefined) {
        user.displayName = displayName;
      }
      if (bio !== undefined) {
        user.bio = bio;
      }
      if (location !== undefined) {
        user.location = location;
      }
      await user.save();

      // Populate the user with followers and following like auth/profile does
      await user.populate(
        "followers",
        "username firstName lastName profile.avatar"
      );
      await user.populate(
        "following",
        "username firstName lastName profile.avatar"
      );

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};

module.exports = userController;
