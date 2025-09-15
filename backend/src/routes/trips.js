const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const { authenticate, authorize } = require("../middleware/auth");
const { generalLimiter } = require("../middleware/rateLimiter");
const {
  validateTripCreation,
  validateTripUpdate,
  validateActivity,
} = require("../middleware/validation");

// All routes require authentication
router.use(authenticate);
router.use(generalLimiter);

// Trip CRUD operations
router.post("/", validateTripCreation, tripController.createTrip);
router.get("/user", tripController.getUserTrips);
router.get("/:tripId", tripController.getTripById);
router.put("/:tripId", validateTripUpdate, tripController.updateTrip);
router.delete("/:tripId", tripController.deleteTrip);

// Activity management
router.post(
  "/:tripId/activities",
  validateActivity,
  tripController.addActivity
);
router.put(
  "/:tripId/activities/:activityId",
  validateActivity,
  tripController.updateActivity
);
router.delete("/:tripId/activities/:activityId", tripController.deleteActivity);

// Collaboration management
router.post("/:tripId/collaborators", tripController.addCollaborator);
router.delete(
  "/:tripId/collaborators/:collaboratorId",
  tripController.removeCollaborator
);

module.exports = router;
