const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [100, "Display name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    avatar: {
      type: String,
      default: "",
    },
    banner: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    location: {
      type: String,
      maxlength: [100, "Location cannot exceed 100 characters"],
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },

    // Gamification System
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    achievements: [
      {
        type: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        earnedAt: {
          type: Date,
          default: Date.now,
        },
        points: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Social Features
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    // Trip Statistics
    tripStats: {
      totalTrips: {
        type: Number,
        default: 0,
      },
      completedTrips: {
        type: Number,
        default: 0,
      },
      collaborativeTrips: {
        type: Number,
        default: 0,
      },
      totalLikes: {
        type: Number,
        default: 0,
      },
      totalShares: {
        type: Number,
        default: 0,
      },
      countriesVisited: {
        type: Number,
        default: 0,
      },
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },

    // Authentication & Security
    refreshTokens: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 2592000, // 30 days
        },
      },
    ],
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Preferences
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        social: {
          type: Boolean,
          default: true,
        },
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ["public", "friends", "private"],
          default: "public",
        },
        tripVisibility: {
          type: String,
          enum: ["public", "friends", "private"],
          default: "public",
        },
      },
      travelPreferences: {
        budget: {
          type: String,
          enum: ["budget", "mid-range", "luxury"],
          default: "mid-range",
        },
        travelStyle: {
          type: String,
          enum: ["adventure", "relaxation", "cultural", "business", "family"],
          default: "adventure",
        },
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for follower count
userSchema.virtual("followerCount").get(function () {
  return this.followers ? this.followers.length : 0;
});

// Virtual for following count
userSchema.virtual("followingCount").get(function () {
  return this.following ? this.following.length : 0;
});

// Index for search optimization
userSchema.index({ firstName: "text", lastName: "text", email: "text" });
userSchema.index({ points: -1 }); // For leaderboard
userSchema.index({ createdAt: -1 }); // For newest users

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { userId: this._id, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};

// Method to add points and check for level up
userSchema.methods.addPoints = async function (
  points,
  reason = "General activity"
) {
  this.points += points;

  // Calculate new level (every 1000 points = 1 level)
  const newLevel = Math.floor(this.points / 1000) + 1;
  const oldLevel = this.level;

  if (newLevel > oldLevel) {
    this.level = newLevel;

    // Add level up achievement
    this.achievements.push({
      type: "level_up",
      name: `Level ${newLevel} Achieved`,
      description: `Congratulations on reaching level ${newLevel}!`,
      points: (newLevel - oldLevel) * 100,
    });
  }

  await this.save();
  return {
    pointsAdded: points,
    newLevel: this.level,
    leveledUp: newLevel > oldLevel,
  };
};

// Method to add achievement
userSchema.methods.addAchievement = async function (
  type,
  name,
  description,
  points = 0
) {
  // Check if achievement already exists
  const existingAchievement = this.achievements.find(
    (ach) => ach.type === type
  );
  if (existingAchievement) {
    return false; // Achievement already earned
  }

  this.achievements.push({
    type,
    name,
    description,
    points,
  });

  if (points > 0) {
    await this.addPoints(points, `Achievement: ${name}`);
  } else {
    await this.save();
  }
  return true; // Achievement successfully added
};

// Virtual for display name
userSchema.virtual("fullDisplayName").get(function () {
  return this.displayName || `${this.firstName} ${this.lastName}`.trim();
});

// Ensure virtual fields are serialized
userSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.emailVerificationToken;
    delete ret.resetPasswordToken;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
