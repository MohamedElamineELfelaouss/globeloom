const authController = require("./src/controllers/authController");
const { auth } = require("./src/middleware/auth");
const { authLimiter, generalLimiter } = require("./src/middleware/rateLimiter");
const {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
} = require("./src/middleware/validation");

console.log("authController:", typeof authController);
console.log("authController.register:", typeof authController.register);
console.log("authController.login:", typeof authController.login);
console.log("authController.refreshToken:", typeof authController.refreshToken);
console.log("authController.logout:", typeof authController.logout);
console.log("authController.getProfile:", typeof authController.getProfile);
console.log(
  "authController.updateProfile:",
  typeof authController.updateProfile
);

console.log("auth:", typeof auth);
console.log("authLimiter:", typeof authLimiter);
console.log("generalLimiter:", typeof generalLimiter);
console.log("validateUserRegistration:", typeof validateUserRegistration);
console.log("validateUserLogin:", typeof validateUserLogin);
console.log("validateUserUpdate:", typeof validateUserUpdate);
