const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { generalLimiter } = require("../middleware/rateLimiter");
const User = require("../models/User");

// All routes require authentication
router.use(authenticate);
router.use(generalLimiter);

// Update avatar with base64 string
router.put("/avatar", async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: "Avatar data is required",
      });
    }

    // Validate base64 string format
    if (!avatar.startsWith("data:image/")) {
      return res.status(400).json({
        success: false,
        message: "Invalid image format. Must be a valid base64 image string.",
      });
    }

    // Update user avatar
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Avatar updated successfully",
      data: {
        user,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Avatar update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update avatar",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Update banner with base64 string
router.put("/banner", async (req, res) => {
  try {
    const { banner } = req.body;

    if (!banner) {
      return res.status(400).json({
        success: false,
        message: "Banner data is required",
      });
    }

    // Validate base64 string format
    if (!banner.startsWith("data:image/")) {
      return res.status(400).json({
        success: false,
        message: "Invalid image format. Must be a valid base64 image string.",
      });
    }

    // Update user banner
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { banner },
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Banner updated successfully",
      data: {
        user,
        banner: user.banner,
      },
    });
  } catch (error) {
    console.error("Banner update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update banner",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
