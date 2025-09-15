const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateTokenPair, verifyRefreshToken } = require("../utils/jwt");
const { validationResult } = require("express-validator");

const authController = {
  // Register new user
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }
      const { email, password, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      } // Hash password
      // Note: Password hashing is handled by User model pre-save hook

      // Create user
      const user = new User({
        email,
        password, // Let the model hash this
        firstName,
        lastName,
      });

      await user.save(); // Generate tokens
      const tokens = generateTokenPair(user._id);

      // Update user with refresh token
      user.refreshTokens.push({
        token: tokens.refreshToken,
        createdAt: new Date(),
      });
      await user.save();

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.refreshTokens;

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: userResponse,
          tokens,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      } // Generate tokens
      const tokens = generateTokenPair(user._id);

      // Clean old refresh tokens (keep last 5)
      user.refreshTokens = user.refreshTokens
        .filter(
          (tokenObj) =>
            tokenObj.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        )
        .slice(-4);

      // Add new refresh token
      user.refreshTokens.push({
        token: tokens.refreshToken,
        createdAt: new Date(),
      });

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Remove sensitive data from response
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.refreshTokens;

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: userResponse,
          tokens,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Refresh access token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token required",
        });
      }

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      // Find user and validate refresh token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      const tokenExists = user.refreshTokens.some(
        (tokenObj) => tokenObj.token === refreshToken
      );
      if (!tokenExists) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      // Generate new tokens      const tokens = generateTokenPair(user._id);

      // Replace old refresh token with new one
      user.refreshTokens = user.refreshTokens.filter(
        (tokenObj) => tokenObj.token !== refreshToken
      );
      user.refreshTokens.push({
        token: tokens.refreshToken,
        createdAt: new Date(),
      });
      await user.save();

      res.json({
        success: true,
        message: "Token refreshed successfully",
        data: { tokens },
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Logout user
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      const userId = req.user.id;

      if (refreshToken) {
        // Remove specific refresh token
        await User.findByIdAndUpdate(userId, {
          $pull: { refreshTokens: { token: refreshToken } },
        });
      } else {
        // Remove all refresh tokens (logout from all devices)
        await User.findByIdAndUpdate(userId, {
          $set: { refreshTokens: [] },
        });
      }

      res.json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .populate("followers", "username firstName lastName profile.avatar")
        .populate("following", "username firstName lastName profile.avatar");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const userId = req.user.id;
      const updateData = req.body;

      // Handle nested profile updates
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update allowed fields
      const allowedFields = ["firstName", "lastName", "username"];
      const allowedProfileFields = ["bio", "location", "website", "avatar"];

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          user[field] = updateData[field];
        }
      });

      if (updateData.profile) {
        allowedProfileFields.forEach((field) => {
          if (updateData.profile[field] !== undefined) {
            user.profile[field] = updateData.profile[field];
          }
        });
      }

      await user.save();

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};

module.exports = authController;
