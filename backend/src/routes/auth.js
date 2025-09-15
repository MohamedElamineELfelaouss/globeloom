const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { authLimiter, generalLimiter } = require("../middleware/rateLimiter");
const {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
} = require("../middleware/validation");

// Public routes
router.post(
  "/register",
  authLimiter,
  validateUserRegistration,
  authController.register
);
router.post("/login", authLimiter, validateUserLogin, authController.login);
router.post("/refresh-token", generalLimiter, authController.refreshToken);

// Protected routes
router.post("/logout", authenticate, authController.logout);
router.get("/profile", authenticate, authController.getProfile);
router.put(
  "/profile",
  authenticate,
  validateUserUpdate,
  authController.updateProfile
);

module.exports = router;
