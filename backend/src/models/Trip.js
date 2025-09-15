const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Activity name is required"],
      trim: true,
      maxlength: [100, "Activity name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [1000, "Activity description cannot exceed 1000 characters"],
    },
    location: {
      name: {
        type: String,
        required: [true, "Location name is required"],
      },
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      country: String,
      city: String,
    },
    datetime: {
      start: {
        type: Date,
        required: [true, "Start date/time is required"],
      },
      end: Date,
    },
    cost: {
      amount: {
        type: Number,
        min: 0,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
        maxlength: 3,
      },
    },
    category: {
      type: String,
      enum: [
        "accommodation",
        "transport",
        "food",
        "attraction",
        "activity",
        "shopping",
        "other",
      ],
      default: "activity",
    },
    status: {
      type: String,
      enum: ["planned", "booked", "completed", "cancelled"],
      default: "planned",
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    images: [
      {
        url: String,
        public_id: String,
        caption: String,
      },
    ],
    bookingInfo: {
      confirmationNumber: String,
      provider: String,
      website: String,
      contact: String,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const tripSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, "Trip title is required"],
      trim: true,
      maxlength: [100, "Trip title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [2000, "Trip description cannot exceed 2000 characters"],
    },
    destinations: [
      {
        name: {
          type: String,
          required: true,
        },
        country: String,
        city: String,
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
        arrivalDate: Date,
        departureDate: Date,
      },
    ],

    // Dates
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    // Trip Details
    status: {
      type: String,
      enum: ["planning", "upcoming", "ongoing", "completed", "cancelled"],
      default: "planning",
    },
    visibility: {
      type: String,
      enum: ["public", "friends", "collaborators", "private"],
      default: "private",
    },
    budget: {
      total: {
        type: Number,
        min: 0,
        default: 0,
      },
      spent: {
        type: Number,
        min: 0,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
        maxlength: 3,
      },
    },

    // People
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["viewer", "editor", "admin"],
          default: "viewer",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        invitedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    // Activities and Itinerary
    activities: [activitySchema],

    // Media
    coverImage: {
      url: String,
      public_id: String,
    },
    images: [
      {
        url: String,
        public_id: String,
        caption: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Social Features
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
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

    // AI and Recommendations
    aiSuggestions: [
      {
        type: {
          type: String,
          enum: ["activity", "restaurant", "accommodation", "transport"],
        },
        suggestion: String,
        confidence: {
          type: Number,
          min: 0,
          max: 1,
        },
        source: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Metadata
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    category: {
      type: String,
      enum: [
        "adventure",
        "relaxation",
        "cultural",
        "business",
        "family",
        "romantic",
        "solo",
        "group",
      ],
      default: "adventure",
    },
    travelStyle: {
      type: String,
      enum: ["budget", "mid-range", "luxury"],
      default: "mid-range",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for trip duration in days
tripSchema.virtual("duration").get(function () {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
});

// Virtual for collaborator count
tripSchema.virtual("collaboratorCount").get(function () {
  return this.collaborators ? this.collaborators.length : 0;
});

// Virtual for activity count
tripSchema.virtual("activityCount").get(function () {
  return this.activities ? this.activities.length : 0;
});

// Virtual for like count
tripSchema.virtual("likeCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
tripSchema.virtual("commentCount").get(function () {
  return this.comments ? this.comments.length : 0;
});

// Indexes for performance
tripSchema.index({ owner: 1, createdAt: -1 });
tripSchema.index({ "collaborators.user": 1 });
tripSchema.index({ startDate: 1, endDate: 1 });
tripSchema.index({ visibility: 1, status: 1 });
tripSchema.index({ "destinations.country": 1 });
tripSchema.index({ tags: 1 });
tripSchema.index({ "stats.totalLikes": -1 }); // For popular trips
tripSchema.index({ createdAt: -1 }); // For recent trips

// Text search index
tripSchema.index({
  title: "text",
  description: "text",
  "destinations.name": "text",
  "destinations.country": "text",
  tags: "text",
});

// Pre-save middleware to update stats
tripSchema.pre("save", function (next) {
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

// Method to check if user can view trip
tripSchema.methods.canUserView = function (userId) {
  if (this.visibility === "public") return true;
  if (this.owner.toString() === userId.toString()) return true;

  if (this.visibility === "collaborators") {
    return this.collaborators.some(
      (collab) => collab.user.toString() === userId.toString()
    );
  }

  return false;
};

// Method to check if user can edit trip
tripSchema.methods.canUserEdit = function (userId) {
  if (this.owner.toString() === userId.toString()) return true;

  const collaborator = this.collaborators.find(
    (collab) => collab.user.toString() === userId.toString()
  );

  return collaborator && ["editor", "admin"].includes(collaborator.role);
};

// Method to add view
tripSchema.methods.addView = async function (userId) {
  this.stats.views += 1;

  // Add unique view if user hasn't viewed before
  if (
    userId &&
    !this.stats.uniqueViews.some(
      (view) => view.user.toString() === userId.toString()
    )
  ) {
    this.stats.uniqueViews.push({ user: userId });
  }

  await this.save();
};

module.exports = mongoose.model("Trip", tripSchema);
