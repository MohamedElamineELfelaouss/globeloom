const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trip = require("../models/Trip");
const bcrypt = require("bcryptjs");

// Debug endpoint to test trip creation with auth
router.post("/test-trip-auth", async (req, res) => {
  try {
    console.log("Testing trip creation with auth...");

    // Check if we have a token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // Manually verify token (similar to auth middleware)
    const token = authHeader.split(" ")[1];
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.userId);
    console.log("Found user:", user ? user.email : "No user found");

    // Simple trip data
    const tripData = {
      title: "Auth Debug Trip",
      description: "Testing trip creation with auth",
      destinations: [
        {
          name: "Test City",
          country: "Test Country",
        },
      ],
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-07-07"),
      visibility: "public",
      owner: decoded.userId,
    };

    console.log("Trip data with owner:", JSON.stringify(tripData, null, 2));

    const trip = new Trip(tripData);
    console.log("Trip instance created, about to save...");

    await trip.save();
    console.log("Trip saved successfully!");

    res.json({
      success: true,
      message: "Trip created successfully",
      trip: trip,
    });
  } catch (error) {
    console.error("Trip creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
});

// Debug endpoint to test trip creation
router.post("/test-trip", async (req, res) => {
  try {
    console.log("Testing trip creation...");

    // Simple trip data
    const tripData = {
      title: "Debug Trip",
      description: "Testing trip creation",
      destinations: [
        {
          name: "Test City",
          country: "Test Country",
        },
      ],
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-07-07"),
      visibility: "public",
      owner: "675f2b86bc1b855cc80b8483", // Use a test user ID
    };

    console.log("Trip data:", JSON.stringify(tripData, null, 2));

    const trip = new Trip(tripData);
    console.log("Trip instance created, about to save...");

    await trip.save();
    console.log("Trip saved successfully!");

    res.json({
      success: true,
      message: "Trip created successfully",
      trip: trip,
    });
  } catch (error) {
    console.error("Trip creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
});

// Debug endpoint to check user data
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("+password");
    res.json({
      success: true,
      count: users.length,
      users: users.map((user) => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordExists: !!user.password,
        passwordLength: user.password ? user.password.length : 0,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Debug endpoint to test password comparison
router.post("/test-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    res.json({
      success: true,
      user: {
        email: user.email,
        passwordExists: !!user.password,
        passwordHash: user.password.substring(0, 10) + "...",
        testPassword: password,
        passwordMatch: isValid,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
