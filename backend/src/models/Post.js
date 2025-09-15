const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    // Author information
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },

    // Post content
    content: {
      type: String,
      required: [true, "Post content is required"],
      maxlength: [2000, "Post content cannot exceed 2000 characters"],
      trim: true,
    },

    // Post media (base64 images)
    images: [
      {
        type: String, // base64 image data
        maxlength: [10485760, "Image size too large"], // ~8MB in base64
      },
    ],

    // Location data
    location: {
      name: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },

    // Tags for categorization
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [50, "Tag cannot exceed 50 characters"],
      },
    ],

    // Social interactions
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: [true, "Comment content is required"],
          maxlength: [500, "Comment cannot exceed 500 characters"],
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        replies: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            content: {
              type: String,
              required: true,
              maxlength: [300, "Reply cannot exceed 300 characters"],
              trim: true,
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],

    shares: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        platform: {
          type: String,
          enum: ["facebook", "twitter", "instagram", "email", "link"],
          default: "link",
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Post metadata
    visibility: {
      type: String,
      enum: ["public", "followers", "private"],
      default: "public",
    },

    status: {
      type: String,
      enum: ["active", "archived", "reported", "deleted"],
      default: "active",
    },

    // Statistics
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      uniqueViews: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          viewedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      totalLikes: {
        type: Number,
        default: 0,
      },
      totalComments: {
        type: Number,
        default: 0,
      },
      totalShares: {
        type: Number,
        default: 0,
      },
    },

    // Related trip (optional)
    relatedTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ "location.name": "text", content: "text", tags: "text" });
postSchema.index({ createdAt: -1 });
postSchema.index({ "stats.totalLikes": -1 });
postSchema.index({ visibility: 1, status: 1 });

// Virtual for post age
postSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diffInMs = now - this.createdAt;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return "1 day ago";
  } else {
    return `${diffInDays} days ago`;
  }
});

// Pre-save middleware to update stats
postSchema.pre("save", function (next) {
  // Initialize arrays if they don't exist
  if (!this.likes) this.likes = [];
  if (!this.comments) this.comments = [];
  if (!this.shares) this.shares = [];

  // Initialize stats if it doesn't exist
  if (!this.stats) {
    this.stats = {
      views: 0,
      uniqueViews: [],
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
    };
  }

  // Update stats
  this.stats.totalLikes = this.likes.length;
  this.stats.totalComments = this.comments.length;
  this.stats.totalShares = this.shares.length;

  next();
});

// Method to check if user can view post
postSchema.methods.canUserView = function (userId) {
  if (this.visibility === "public") return true;
  if (this.author.toString() === userId.toString()) return true;

  // For followers visibility, we would need to check if user follows the author
  // This would require a separate query or populated data
  return false;
};

// Method to check if user has liked the post
postSchema.methods.isLikedBy = function (userId) {
  return this.likes.some((like) => like.user.toString() === userId.toString());
};

// Method to add a view
postSchema.methods.addView = function (userId) {
  this.stats.views += 1;

  // Add to unique views if not already viewed by this user
  if (
    userId &&
    !this.stats.uniqueViews.some(
      (view) => view.user.toString() === userId.toString()
    )
  ) {
    this.stats.uniqueViews.push({ user: userId });
  }
};

module.exports = mongoose.model("Post", postSchema);
