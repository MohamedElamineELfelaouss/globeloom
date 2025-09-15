const User = require("../models/User");
const { verifyToken, extractTokenFromHeader } = require("../utils/jwt");

/**
 * Middleware to authenticate user using JWT
 */
const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = verifyToken(token, "access");

    // Get user from database
    const user = await User.findById(decoded.userId)
      .select("-password -refreshTokens")
      .populate("achievements");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated.",
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
};

/**
 * Middleware to check if user is authenticated (optional)
 * Sets req.user if token is valid, but doesn't throw error if not
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token, "access");
      const user = await User.findById(decoded.userId).select(
        "-password -refreshTokens"
      );

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Silent fail for optional auth
    next();
  }
};

/**
 * Middleware to authorize user roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions.",
      });
    }

    next();
  };
};

/**
 * Middleware to check if user owns the resource
 * @param {string} resourceUserField - Field name that contains the user ID (default: 'owner')
 */
const checkResourceOwnership = (resourceUserField = "owner") => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      // Resource ID should be in req.params or req.body
      const resourceId =
        req.params.id || req.params.tripId || req.params.userId;

      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: "Resource ID is required.",
        });
      }

      // Find the resource (you might need to customize this based on your models)
      let resource;
      if (req.baseUrl.includes("/trips")) {
        const Trip = require("../models/Trip");
        resource = await Trip.findById(resourceId);
      } else if (req.baseUrl.includes("/users")) {
        resource = await User.findById(resourceId);
      }

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found.",
        });
      }

      // Check ownership
      const ownerId =
        resource[resourceUserField]?.toString() || resource._id?.toString();

      if (ownerId !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied. You do not own this resource.",
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error("Resource ownership check error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Server error during authorization check.",
      });
    }
  };
};

/**
 * Middleware to validate refresh token
 */
const validateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required.",
      });
    }

    const decoded = verifyToken(refreshToken, "refresh");

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token. User not found.",
      });
    }

    // Check if refresh token exists in user's token list
    const tokenExists = user.refreshTokens.some(
      (tokenObj) => tokenObj.token === refreshToken
    );

    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token.",
      });
    }

    req.user = user;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    console.error("Refresh token validation error:", error.message);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during refresh token validation.",
    });
  }
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  checkResourceOwnership,
  validateRefreshToken,
};
