const express = require("express");
const router = express.Router();
const communityController = require("../controllers/communityController");
const { authenticate } = require("../middleware/auth");
const { generalLimiter } = require("../middleware/rateLimiter");
const { body } = require("express-validator");

// All routes require authentication
router.use(authenticate);
router.use(generalLimiter);

// Validation middleware for creating posts
const validatePostCreation = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Content must be between 1 and 2000 characters"),
  body("images")
    .optional()
    .isArray({ max: 5 })
    .withMessage("Maximum 5 images allowed"),
  body("tags")
    .optional()
    .isArray({ max: 10 })
    .withMessage("Maximum 10 tags allowed"),
  body("visibility")
    .optional()
    .isIn(["public", "followers", "private"])
    .withMessage("Invalid visibility setting"),
];

// Validation middleware for comments
const validateComment = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Comment must be between 1 and 500 characters"),
];

// Community feed and discovery
router.get("/feed", communityController.getFeed);
router.get("/posts", communityController.getFeed); // Alias for feed
router.get("/stats", communityController.getCommunityStats);
router.get("/trending-tags", communityController.getTrendingTags);
router.get("/suggested-users", communityController.getSuggestedUsers);

// User profiles
router.get("/users/:userId", communityController.getUserProfile);

// Post management
router.post("/posts", validatePostCreation, communityController.createPost);
router.get("/posts/:postId", communityController.getPost);
router.delete("/posts/:postId", communityController.deletePost);

// Post interactions
router.post("/posts/:postId/like", communityController.toggleLike);
router.post(
  "/posts/:postId/comments",
  validateComment,
  communityController.addComment
);
router.post("/posts/:postId/share", communityController.sharePost);
router.post("/posts/:postId/bookmark", communityController.toggleBookmark);

// Saved/Bookmarked posts
router.get("/saved", communityController.getSavedPosts);

module.exports = router;
