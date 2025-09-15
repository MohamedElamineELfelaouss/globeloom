const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { generalLimiter, searchLimiter } = require("../middleware/rateLimiter");
const { validatePreferences } = require("../middleware/validation");

// All routes require authentication
router.use(authenticate);

// User search and discovery
router.get("/search", searchLimiter, userController.searchUsers);
router.get("/leaderboard", generalLimiter, userController.getLeaderboard);

// User profile operations
router.get("/:userId", generalLimiter, userController.getUserProfile);
router.put("/profile", generalLimiter, userController.updateProfile);

// Social features
router.post("/:userId/follow", generalLimiter, userController.followUser);
router.delete("/:userId/follow", generalLimiter, userController.unfollowUser);
router.get("/:userId/followers", generalLimiter, userController.getFollowers);
router.get("/:userId/following", generalLimiter, userController.getFollowing);

// User preferences
router.put(
  "/preferences",
  generalLimiter,
  validatePreferences,
  userController.updatePreferences
);

module.exports = router;
