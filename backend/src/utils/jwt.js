const jwt = require("jsonwebtoken");

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @param {string} type - Token type ('access' or 'refresh')
 * @returns {string} - JWT token
 */
const generateToken = (userId, type = "access") => {
  const secret =
    type === "refresh"
      ? process.env.JWT_REFRESH_SECRET
      : process.env.JWT_SECRET;
  const expiresIn =
    type === "refresh"
      ? process.env.JWT_REFRESH_EXPIRE
      : process.env.JWT_EXPIRE;

  return jwt.sign({ userId, type }, secret, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} type - Token type ('access' or 'refresh')
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token, type = "access") => {
  const secret =
    type === "refresh"
      ? process.env.JWT_REFRESH_SECRET
      : process.env.JWT_SECRET;

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error(`Invalid ${type} token`);
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Extracted token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

/**
 * Generate token pair (access and refresh)
 * @param {string} userId - User ID
 * @returns {Object} - Object containing access and refresh tokens
 */
const generateTokenPair = (userId) => {
  return {
    accessToken: generateToken(userId, "access"),
    refreshToken: generateToken(userId, "refresh"),
  };
};

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Verify refresh token specifically
 * @param {string} token - Refresh token
 * @returns {Object} - Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return verifyToken(token, "refresh");
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  generateTokenPair,
  decodeToken,
  verifyRefreshToken,
};
