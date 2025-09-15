const Trip = require("../models/Trip");
const User = require("../models/User");
const { validationResult } = require("express-validator");

const tripController = {
  // Create new trip
  async createTrip(req, res) {
    try {
      console.log("=== Trip Creation Debug ===");
      console.log("req.user:", req.user ? "exists" : "undefined");
      console.log("req.user._id:", req.user ? req.user._id : "N/A");
      console.log("req.body:", JSON.stringify(req.body, null, 2));

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }
      const userId = req.user._id;
      const tripData = { ...req.body, owner: userId };

      console.log("Final trip data:", JSON.stringify(tripData, null, 2));

      // Set default dates if not provided
      if (!tripData.startDate) {
        tripData.startDate = new Date();
      }
      if (!tripData.endDate) {
        tripData.endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      }

      console.log("About to create Trip instance...");
      const trip = new Trip(tripData);
      console.log("Trip instance created, about to save...");
      await trip.save();
      console.log("Trip saved successfully!");

      // Populate owner info
      await trip.populate("owner", "firstName lastName email");

      res.status(201).json({
        success: true,
        message: "Trip created successfully",
        data: { trip },
      });
    } catch (error) {
      console.error("Create trip error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get user's trips
  async getUserTrips(req, res) {
    try {
      const userId = req.user._id;
      const {
        status,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const query = {
        $or: [{ owner: userId }, { "collaborators.user": userId }],
      };

      if (status) {
        query.status = status;
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const trips = await Trip.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("owner", "username firstName lastName profile.avatar")
        .populate(
          "collaborators.user",
          "username firstName lastName profile.avatar"
        );

      const total = await Trip.countDocuments(query);

      res.json({
        success: true,
        data: {
          trips,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get user trips error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get trip by ID
  async getTripById(req, res) {
    try {
      const { tripId } = req.params;
      const userId = req.user._id;

      const trip = await Trip.findById(tripId)
        .populate("owner", "username firstName lastName profile.avatar")
        .populate(
          "collaborators.user",
          "username firstName lastName profile.avatar"
        )
        .populate(
          "activities.addedBy",
          "username firstName lastName profile.avatar"
        )
        .populate(
          "comments.user",
          "username firstName lastName profile.avatar"
        );

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      } // Check if user has access to trip
      const hasAccess =
        trip.owner._id.toString() === userId.toString() ||
        trip.collaborators.some(
          (collab) => collab.user._id.toString() === userId.toString()
        ) ||
        trip.visibility === "public";

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      res.json({
        success: true,
        data: { trip },
      });
    } catch (error) {
      console.error("Get trip error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Update trip
  async updateTrip(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { tripId } = req.params;
      const userId = req.user._id;
      const updateData = req.body;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      } // Check if user can edit trip (owner or collaborator with edit permission)
      const canEdit =
        trip.owner.toString() === userId ||
        trip.collaborators.some((collab) => collab.toString() === userId);

      if (!canEdit) {
        return res.status(403).json({
          success: false,
          message: "Permission denied",
        });
      }

      // Update trip
      Object.assign(trip, updateData);
      trip.updatedAt = new Date();
      await trip.save();

      // Populate updated trip
      await trip.populate(
        "owner",
        "username firstName lastName profile.avatar"
      );
      await trip.populate(
        "collaborators",
        "username firstName lastName profile.avatar"
      );

      res.json({
        success: true,
        message: "Trip updated successfully",
        data: { trip },
      });
    } catch (error) {
      console.error("Update trip error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Delete trip
  async deleteTrip(req, res) {
    try {
      const { tripId } = req.params;
      const userId = req.user._id;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      } // Only owner can delete trip
      if (trip.owner.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Only trip owner can delete the trip",
        });
      }

      await Trip.findByIdAndDelete(tripId);

      res.json({
        success: true,
        message: "Trip deleted successfully",
      });
    } catch (error) {
      console.error("Delete trip error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Add activity to trip
  async addActivity(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { tripId } = req.params;
      const userId = req.user._id;
      const activityData = req.body;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      } // Check if user can add activities
      const canEdit =
        trip.owner.toString() === userId.toString() ||
        trip.collaborators.some(
          (collab) => collab.user.toString() === userId.toString()
        );

      if (!canEdit) {
        return res.status(403).json({
          success: false,
          message: "Permission denied",
        });
      } // Add activity
      trip.activities.push({
        ...activityData,
        addedBy: userId,
        createdAt: new Date(),
      });

      await trip.save();

      // Get the newly added activity
      const newActivity = trip.activities[trip.activities.length - 1];
      await trip.populate(
        "activities.addedBy",
        "username firstName lastName profile.avatar"
      );

      res.status(201).json({
        success: true,
        message: "Activity added successfully",
        data: { activity: newActivity },
      });
    } catch (error) {
      console.error("Add activity error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Update activity
  async updateActivity(req, res) {
    try {
      const { tripId, activityId } = req.params;
      const userId = req.user._id;
      const updateData = req.body;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      }

      const activity = trip.activities.id(activityId);
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: "Activity not found",
        });
      } // Check permissions
      const canEdit =
        trip.owner.toString() === userId ||
        activity.createdBy.toString() === userId ||
        trip.collaborators.some((collab) => collab.toString() === userId);

      if (!canEdit) {
        return res.status(403).json({
          success: false,
          message: "Permission denied",
        });
      }

      // Update activity
      Object.assign(activity, updateData);
      activity.updatedAt = new Date();
      await trip.save();

      res.json({
        success: true,
        message: "Activity updated successfully",
        data: { activity },
      });
    } catch (error) {
      console.error("Update activity error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Delete activity
  async deleteActivity(req, res) {
    try {
      const { tripId, activityId } = req.params;
      const userId = req.user._id;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      }

      const activity = trip.activities.id(activityId);
      if (!activity) {
        return res.status(404).json({
          success: false,
          message: "Activity not found",
        });
      } // Check permissions
      const canDelete =
        trip.owner.toString() === userId ||
        activity.createdBy.toString() === userId;

      if (!canDelete) {
        return res.status(403).json({
          success: false,
          message: "Permission denied",
        });
      }

      // Remove activity
      trip.activities.pull(activityId);
      await trip.save();

      res.json({
        success: true,
        message: "Activity deleted successfully",
      });
    } catch (error) {
      console.error("Delete activity error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Add collaborator to trip
  async addCollaborator(req, res) {
    try {
      const { tripId } = req.params;
      const { userId: collaboratorId } = req.body;
      const userId = req.user._id;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      } // Only owner can add collaborators
      if (trip.owner.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Only trip owner can add collaborators",
        });
      }

      // Check if user exists
      const collaborator = await User.findById(collaboratorId);
      if (!collaborator) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if already a collaborator
      if (trip.collaborators.includes(collaboratorId)) {
        return res.status(400).json({
          success: false,
          message: "User is already a collaborator",
        });
      }

      // Add collaborator
      trip.collaborators.push(collaboratorId);
      await trip.save();

      await trip.populate(
        "collaborators",
        "username firstName lastName profile.avatar"
      );

      res.json({
        success: true,
        message: "Collaborator added successfully",
        data: { trip },
      });
    } catch (error) {
      console.error("Add collaborator error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Remove collaborator from trip
  async removeCollaborator(req, res) {
    try {
      const { tripId, collaboratorId } = req.params;
      const userId = req.user._id;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      } // Only owner can remove collaborators
      if (trip.owner.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Only trip owner can remove collaborators",
        });
      }

      // Remove collaborator
      trip.collaborators.pull(collaboratorId);
      await trip.save();

      res.json({
        success: true,
        message: "Collaborator removed successfully",
      });
    } catch (error) {
      console.error("Remove collaborator error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};

module.exports = tripController;
