const { body, param, query, validationResult } = require("express-validator");

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }

  next();
};

/**
 * User registration validation rules
 */
const validateUserRegistration = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  handleValidationErrors,
];

/**
 * User login validation rules
 */
const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

/**
 * Trip creation validation rules
 */
const validateTripCreation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Trip title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Trip title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date")
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        throw new Error("Start date cannot be in the past");
      }
      return true;
    }),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);

      if (endDate <= startDate) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("destinations")
    .isArray({ min: 1 })
    .withMessage("At least one destination is required"),

  body("destinations.*.name")
    .trim()
    .notEmpty()
    .withMessage("Destination name is required"),

  body("destinations.*.country")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Country name cannot exceed 100 characters"),

  body("visibility")
    .optional()
    .isIn(["public", "friends", "collaborators", "private"])
    .withMessage("Invalid visibility option"),

  body("budget.total")
    .optional()
    .isNumeric()
    .withMessage("Budget must be a number")
    .custom((value) => {
      if (value < 0) {
        throw new Error("Budget cannot be negative");
      }
      return true;
    }),

  body("budget.currency")
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency code must be exactly 3 characters"),

  handleValidationErrors,
];

/**
 * Trip update validation rules
 */
const validateTripUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Trip title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (req.body.startDate && value) {
        const endDate = new Date(value);
        const startDate = new Date(req.body.startDate);

        if (endDate <= startDate) {
          throw new Error("End date must be after start date");
        }
      }
      return true;
    }),

  body("visibility")
    .optional()
    .isIn(["public", "friends", "collaborators", "private"])
    .withMessage("Invalid visibility option"),

  body("status")
    .optional()
    .isIn(["planning", "upcoming", "ongoing", "completed", "cancelled"])
    .withMessage("Invalid status option"),

  handleValidationErrors,
];

/**
 * Activity validation rules
 */
const validateActivity = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Activity name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Activity name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("location.name")
    .trim()
    .notEmpty()
    .withMessage("Location name is required"),

  body("datetime.start")
    .notEmpty()
    .withMessage("Start date/time is required")
    .isISO8601()
    .withMessage("Start date/time must be a valid date"),

  body("datetime.end")
    .optional()
    .isISO8601()
    .withMessage("End date/time must be a valid date")
    .custom((value, { req }) => {
      if (value && req.body.datetime && req.body.datetime.start) {
        const endTime = new Date(value);
        const startTime = new Date(req.body.datetime.start);

        if (endTime <= startTime) {
          throw new Error("End time must be after start time");
        }
      }
      return true;
    }),

  body("cost.amount")
    .optional()
    .isNumeric()
    .withMessage("Cost amount must be a number")
    .custom((value) => {
      if (value < 0) {
        throw new Error("Cost cannot be negative");
      }
      return true;
    }),

  body("category")
    .optional()
    .isIn([
      "accommodation",
      "transport",
      "food",
      "attraction",
      "activity",
      "shopping",
      "other",
    ])
    .withMessage("Invalid activity category"),

  handleValidationErrors,
];

/**
 * Comment validation rules
 */
const validateComment = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Comment must be between 1 and 500 characters"),

  handleValidationErrors,
];

/**
 * MongoDB ObjectId validation
 */
const validateObjectId = (field = "id") => [
  param(field).isMongoId().withMessage(`Invalid ${field} format`),

  handleValidationErrors,
];

/**
 * Query pagination validation
 */
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sortBy")
    .optional()
    .isIn(["createdAt", "updatedAt", "title", "startDate", "likes", "views"])
    .withMessage("Invalid sort field"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),

  handleValidationErrors,
];

/**
 * User profile update validation
 */
const validateUserUpdate = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Date of birth must be a valid date")
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 13 || age > 120) {
        throw new Error("Age must be between 13 and 120 years");
      }
      return true;
    }),
  handleValidationErrors,
];

/**
 * User preferences validation rules
 */
const validatePreferences = [
  body("travelStyle")
    .optional()
    .isIn([
      "adventure",
      "relaxation",
      "cultural",
      "business",
      "luxury",
      "budget",
    ])
    .withMessage("Invalid travel style"),

  body("accommodationType")
    .optional()
    .isIn(["hotel", "hostel", "apartment", "resort", "guesthouse", "camping"])
    .withMessage("Invalid accommodation type"),

  body("budgetRange")
    .optional()
    .isIn(["budget", "mid-range", "luxury", "ultra-luxury"])
    .withMessage("Invalid budget range"),

  body("preferredActivities")
    .optional()
    .isArray()
    .withMessage("Preferred activities must be an array"),

  body("preferredActivities.*")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each activity must be between 1 and 50 characters"),

  body("dietaryRestrictions")
    .optional()
    .isArray()
    .withMessage("Dietary restrictions must be an array"),

  body("dietaryRestrictions.*")
    .optional()
    .isIn([
      "vegetarian",
      "vegan",
      "halal",
      "kosher",
      "gluten-free",
      "dairy-free",
      "nut-free",
    ])
    .withMessage("Invalid dietary restriction"),

  body("languages")
    .optional()
    .isArray()
    .withMessage("Languages must be an array"),

  body("languages.*")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Each language must be between 2 and 50 characters"),

  body("notifications.email")
    .optional()
    .isBoolean()
    .withMessage("Email notification preference must be a boolean"),

  body("notifications.push")
    .optional()
    .isBoolean()
    .withMessage("Push notification preference must be a boolean"),

  body("notifications.sms")
    .optional()
    .isBoolean()
    .withMessage("SMS notification preference must be a boolean"),

  body("privacy.profileVisibility")
    .optional()
    .isIn(["public", "friends", "private"])
    .withMessage("Invalid profile visibility setting"),

  body("privacy.showTripHistory")
    .optional()
    .isBoolean()
    .withMessage("Show trip history preference must be a boolean"),

  body("privacy.allowFriendRequests")
    .optional()
    .isBoolean()
    .withMessage("Allow friend requests preference must be a boolean"),

  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateTripCreation,
  validateTripUpdate,
  validateActivity,
  validateComment,
  validateObjectId,
  validatePagination,
  validateUserUpdate,
  validatePreferences,
};
