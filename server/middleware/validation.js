const { body, param, query } = require("express-validator");
const { validationResult } = require("express-validator");

// Validation middleware
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Task creation validation
exports.createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("description").optional().trim(),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage("Status must be pending or completed"),
];

// Task update validation
exports.updateTaskValidation = [
  param("id").isMongoId().withMessage("Invalid task ID"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("description").optional().trim(),

  body("dueDate").optional().isISO8601().withMessage("Invalid date format"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage("Status must be pending or completed"),
];

// Task status update validation
exports.updateTaskStatusValidation = [
  param("id").isMongoId().withMessage("Invalid task ID"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "completed"])
    .withMessage("Status must be pending or completed"),
];

// Query parameter validation
exports.queryValidation = [
  query("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage("Invalid status filter"),

  query("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority filter"),
];
