const Post = require("../models/Post");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const {
  ensureGamification,
  addPoints,
  getTotalPoints,
  updateStats,
} = require("../utils/gamificationHelper");

const communityController = {
  // Get community feed posts
  async getFeed(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        filter = "all", // all, following, trending
        tags,
      } = req.query;

      const userId = req.user._id;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      let query = { status: "active" };
      let sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Apply filters
      if (filter === "following") {
        const currentUser = await User.findById(userId).select("following");
        query.author = { $in: [...currentUser.following, userId] };
      } else if (filter === "trending") {
        // For trending, sort by engagement (likes + comments + shares) in last 7 days
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        query.createdAt = { $gte: oneWeekAgo };
        sortOptions = { "stats.totalLikes": -1, "stats.totalComments": -1 };
      } // Enhanced search functionality - search by content, tags, and location
      if (tags) {
        const searchTerms = tags
          .split(",")
          .map((term) => term.trim().toLowerCase());

        // Create a comprehensive search query
        query.$or = [
          // Search in tags
          { tags: { $in: searchTerms } },
          // Search in content (case-insensitive)
          { content: { $regex: searchTerms.join("|"), $options: "i" } },
          // Search in location name
          { "location.name": { $regex: searchTerms.join("|"), $options: "i" } },
          // Search in author display name
          {
            "author.displayName": {
              $regex: searchTerms.join("|"),
              $options: "i",
            },
          },
        ];
      }

      // Apply visibility filters
      if (filter !== "following") {
        query.visibility = "public";
      }

      const posts = await Post.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("author", "firstName lastName displayName avatar bio")
        .populate("comments.user", "firstName lastName displayName avatar")
        .populate("likes.user", "firstName lastName displayName")
        .lean();

      const total = await Post.countDocuments(query);

      // Add user interaction flags
      const postsWithInteractions = posts.map((post) => ({
        ...post,
        isLiked: post.likes.some(
          (like) => like.user._id.toString() === userId.toString()
        ),
        userLikeId: post.likes.find(
          (like) => like.user._id.toString() === userId.toString()
        )?._id,
      }));

      res.json({
        success: true,
        data: {
          posts: postsWithInteractions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get feed error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Create a new post
  async createPost(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const userId = req.user._id;
      const { content, images, location, tags, visibility, relatedTrip } =
        req.body;

      const post = new Post({
        author: userId,
        content,
        images: images || [],
        location,
        tags: tags || [],
        visibility: visibility || "public",
        relatedTrip,
      });

      await post.save();

      // Populate author info
      await post.populate(
        "author",
        "firstName lastName displayName avatar bio"
      ); // Award points for social interaction
      const user = await User.findById(userId);
      addPoints(user, 10); // Points for creating a post
      updateStats(user, "post_created");
      await user.save();

      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: { post },
      });
    } catch (error) {
      console.error("Create post error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get a single post by ID
  async getPost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user._id;

      const post = await Post.findById(postId)
        .populate("author", "firstName lastName displayName avatar bio")
        .populate("comments.user", "firstName lastName displayName avatar")
        .populate(
          "comments.replies.user",
          "firstName lastName displayName avatar"
        )
        .populate("likes.user", "firstName lastName displayName");

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Check if user can view the post
      if (!post.canUserView(userId)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Add view to post
      post.addView(userId);
      await post.save();

      // Add user interaction flags
      const postData = post.toObject();
      postData.isLiked = post.isLikedBy(userId);

      res.json({
        success: true,
        data: { post: postData },
      });
    } catch (error) {
      console.error("Get post error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Like/unlike a post
  async toggleLike(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user._id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      const existingLikeIndex = post.likes.findIndex(
        (like) => like.user.toString() === userId.toString()
      );

      let isLiked = false;
      if (existingLikeIndex > -1) {
        // Unlike the post
        post.likes.splice(existingLikeIndex, 1);
      } else {
        // Like the post
        post.likes.push({ user: userId });
        isLiked = true; // Award points to post author
        const author = await User.findById(post.author);
        if (author) {
          addPoints(author, 2); // Points for receiving a like
          updateStats(author, "like_received");
          await author.save();
        }
      }

      await post.save();

      res.json({
        success: true,
        message: isLiked ? "Post liked" : "Post unliked",
        data: {
          isLiked,
          totalLikes: post.likes.length,
        },
      });
    } catch (error) {
      console.error("Toggle like error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Add a comment to a post
  async addComment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { postId } = req.params;
      const { content } = req.body;
      const userId = req.user._id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      const comment = {
        user: userId,
        content,
      };

      post.comments.push(comment);
      await post.save();

      // Populate the new comment
      await post.populate(
        "comments.user",
        "firstName lastName displayName avatar"
      ); // Award points to commenter and post author
      const [commenter, author] = await Promise.all([
        User.findById(userId),
        User.findById(post.author),
      ]);

      if (commenter) {
        addPoints(commenter, 5); // Points for commenting
        await commenter.save();
      }

      if (author && author._id.toString() !== userId.toString()) {
        addPoints(author, 3); // Points for receiving a comment
        updateStats(author, "comment_received");
        await author.save();
      }

      const newComment = post.comments[post.comments.length - 1];

      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: {
          comment: newComment,
          totalComments: post.comments.length,
        },
      });
    } catch (error) {
      console.error("Add comment error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Share a post
  async sharePost(req, res) {
    try {
      const { postId } = req.params;
      const { platform = "link" } = req.body;
      const userId = req.user._id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Check if user already shared this post
      const existingShare = post.shares.find(
        (share) =>
          share.user.toString() === userId.toString() &&
          share.platform === platform
      );

      if (!existingShare) {
        post.shares.push({ user: userId, platform });
        await post.save(); // Award points to sharer and post author
        const [sharer, author] = await Promise.all([
          User.findById(userId),
          User.findById(post.author),
        ]);

        if (sharer) {
          addPoints(sharer, 3); // Points for sharing
          await sharer.save();
        }

        if (author && author._id.toString() !== userId.toString()) {
          addPoints(author, 5); // Points for having post shared
          updateStats(author, "share_received");
          await author.save();
        }
      }

      res.json({
        success: true,
        message: "Post shared successfully",
        data: {
          totalShares: post.shares.length,
        },
      });
    } catch (error) {
      console.error("Share post error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get trending tags
  async getTrendingTags(req, res) {
    try {
      const { limit = 10 } = req.query;

      // Get trending tags from posts in the last 7 days
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const trendingTags = await Post.aggregate([
        {
          $match: {
            createdAt: { $gte: oneWeekAgo },
            status: "active",
            visibility: "public",
          },
        },
        { $unwind: "$tags" },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
            totalLikes: { $sum: "$stats.totalLikes" },
            totalComments: { $sum: "$stats.totalComments" },
          },
        },
        {
          $addFields: {
            score: {
              $add: [
                "$count",
                { $multiply: ["$totalLikes", 0.5] },
                { $multiply: ["$totalComments", 0.3] },
              ],
            },
          },
        },
        { $sort: { score: -1 } },
        { $limit: parseInt(limit) },
        {
          $project: {
            tag: "$_id",
            count: 1,
            score: 1,
            _id: 0,
          },
        },
      ]);

      res.json({
        success: true,
        data: { trendingTags },
      });
    } catch (error) {
      console.error("Get trending tags error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get community stats
  async getCommunityStats(req, res) {
    try {
      const [totalUsers, totalPosts, totalCountries] = await Promise.all([
        User.countDocuments({ status: { $ne: "deleted" } }),
        Post.countDocuments({ status: "active" }),
        User.distinct("location").then(
          (locations) => locations.filter(Boolean).length
        ),
      ]);

      // Get active users (posted or interacted in last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const activeUsers = await User.countDocuments({
        $or: [
          { lastLogin: { $gte: thirtyDaysAgo } },
          { createdAt: { $gte: thirtyDaysAgo } },
        ],
      });

      res.json({
        success: true,
        data: {
          stats: {
            activeTravelers: activeUsers,
            storiesShared: totalPosts,
            countriesCovered: totalCountries,
            totalUsers,
          },
        },
      });
    } catch (error) {
      console.error("Get community stats error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
  // Get suggested users for community
  async getSuggestedUsers(req, res) {
    try {
      const { limit = 5 } = req.query;
      const userId = req.user._id;

      const currentUser = await User.findById(userId).select("following");

      // Smart algorithm: Get users based on mutual connections, activity, and engagement
      const suggestedUsers = await User.aggregate([
        {
          // Exclude current user and already following users
          $match: {
            _id: { $nin: [...currentUser.following, userId] },
            status: { $ne: "deleted" },
          },
        },
        {
          // Add calculated score based on various factors
          $addFields: {
            mutualConnectionsCount: {
              $size: {
                $setIntersection: ["$followers", currentUser.following],
              },
            },
            totalEngagement: {
              $add: [
                { $ifNull: ["$gamification.stats.postsCreated", 0] },
                { $ifNull: ["$gamification.stats.likesReceived", 0] },
                { $ifNull: ["$gamification.stats.commentsReceived", 0] },
              ],
            },
            followerCount: { $size: "$followers" },
            isNewUser: {
              $lt: [
                "$createdAt",
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              ],
            },
          },
        },
        {
          // Calculate smart suggestion score
          $addFields: {
            suggestionScore: {
              $add: [
                // Mutual connections boost (most important)
                { $multiply: ["$mutualConnectionsCount", 10] },
                // Total points boost
                {
                  $multiply: [
                    { $ifNull: ["$gamification.totalPoints", 0] },
                    0.01,
                  ],
                },
                // Engagement boost
                { $multiply: ["$totalEngagement", 0.5] },
                // Follower count boost (but not too much to avoid only suggesting popular users)
                { $multiply: ["$followerCount", 0.1] },
                // New user boost (help new users get discovered)
                { $cond: ["$isNewUser", 5, 0] },
                // Random factor for diversity
                { $multiply: [{ $rand: {} }, 2] },
              ],
            },
          },
        },
        { $sort: { suggestionScore: -1 } },
        { $limit: parseInt(limit) },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            displayName: 1,
            avatar: 1,
            bio: 1,
            gamification: 1,
            followerCount: 1,
            mutualConnectionsCount: 1,
            suggestionScore: 1,
          },
        },
      ]);

      // Get follower counts and total points for each suggested user
      const usersWithStats = suggestedUsers.map((user) => ({
        ...user,
        totalPoints: getTotalPoints(user),
        followerCount: user.followerCount || 0,
        mutualConnections: user.mutualConnectionsCount || 0,
      }));

      res.json({
        success: true,
        data: { suggestedUsers: usersWithStats },
      });
    } catch (error) {
      console.error("Get suggested users error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Delete a post
  async deletePost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user._id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Check if user is the author
      if (post.author.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own posts",
        });
      }

      post.status = "deleted";
      await post.save();

      res.json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Delete post error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get user profile for community (public view)
  async getUserProfile(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user._id;

      // Get user basic info
      const user = await User.findById(userId)
        .select(
          "firstName lastName displayName avatar bio location gamification followers following createdAt"
        )
        .populate("followers", "firstName lastName displayName avatar")
        .populate("following", "firstName lastName displayName avatar");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Get user's public posts
      const posts = await Post.find({
        author: userId,
        status: "active",
        visibility: "public",
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("author", "firstName lastName displayName avatar bio")
        .populate("comments.user", "firstName lastName displayName avatar")
        .lean();

      // Add interaction flags for current user
      const postsWithInteractions = posts.map((post) => ({
        ...post,
        isLiked: post.likes.some(
          (like) => like.user.toString() === currentUserId.toString()
        ),
      }));

      // Check if current user follows this user
      const isFollowing = user.followers.some(
        (follower) => follower._id.toString() === currentUserId.toString()
      );

      // Get user stats
      const userStats = {
        postsCount: await Post.countDocuments({
          author: userId,
          status: "active",
        }),
        followersCount: user.followers.length,
        followingCount: user.following.length,
        totalPoints: getTotalPoints(user),
        level: user.gamification?.level || 1,
        joinedDate: user.createdAt,
        achievements: user.gamification?.achievements || [],
        badges: user.gamification?.badges || [],
      };

      res.json({
        success: true,
        data: {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            avatar: user.avatar,
            bio: user.bio,
            location: user.location,
            isFollowing,
            stats: userStats,
          },
          posts: postsWithInteractions,
        },
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

  // Bookmark/Save a post
  async toggleBookmark(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user._id;

      const [post, user] = await Promise.all([
        Post.findById(postId),
        User.findById(userId),
      ]);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Initialize savedPosts array if it doesn't exist
      if (!user.savedPosts) {
        user.savedPosts = [];
      }

      const isBookmarked = user.savedPosts.includes(postId);

      if (isBookmarked) {
        // Remove bookmark
        user.savedPosts = user.savedPosts.filter(
          (id) => id.toString() !== postId
        );
      } else {
        // Add bookmark
        user.savedPosts.push(postId);
      }

      await user.save();

      res.json({
        success: true,
        message: isBookmarked
          ? "Post removed from saved"
          : "Post saved successfully",
        data: {
          isBookmarked: !isBookmarked,
          totalSaved: user.savedPosts.length,
        },
      });
    } catch (error) {
      console.error("Toggle bookmark error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get saved posts
  async getSavedPosts(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user._id;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const user = await User.findById(userId).select("savedPosts");

      if (!user.savedPosts || user.savedPosts.length === 0) {
        return res.json({
          success: true,
          data: {
            posts: [],
            pagination: { page: 1, limit: parseInt(limit), total: 0, pages: 0 },
          },
        });
      }

      const posts = await Post.find({
        _id: { $in: user.savedPosts },
        status: "active",
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("author", "firstName lastName displayName avatar bio")
        .populate("comments.user", "firstName lastName displayName avatar")
        .lean();

      const total = user.savedPosts.length;

      // Add user interaction flags
      const postsWithInteractions = posts.map((post) => ({
        ...post,
        isLiked: post.likes.some(
          (like) => like.user.toString() === userId.toString()
        ),
        isBookmarked: true, // All posts in this endpoint are bookmarked
      }));

      res.json({
        success: true,
        data: {
          posts: postsWithInteractions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get saved posts error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};

module.exports = communityController;
