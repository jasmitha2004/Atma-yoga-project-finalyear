const { body, param, query } = require("express-validator");

/**
 * Validation rules for Question operations
 */
exports.validateQuestion = {
  create: [
    body("questionText")
      .trim()
      .notEmpty()
      .withMessage("Question text is required")
      .isLength({ min: 3, max: 500 })
      .withMessage("Question text must be between 3 and 500 characters"),
    body("questionType")
      .notEmpty()
      .withMessage("Question type is required")
      .isIn(["text", "select", "checkbox", "radio", "textarea", "number"])
      .withMessage("Invalid question type"),
    body("category")
      .notEmpty()
      .withMessage("Category is required")
      .isIn(["pose-related", "feedback", "general", "health", "session"])
      .withMessage("Invalid category"),
    body("options")
      .optional()
      .isArray()
      .withMessage("Options must be an array"),
    body("isRequired")
      .optional()
      .isBoolean()
      .withMessage("isRequired must be a boolean"),
    body("order")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Order must be a non-negative integer"),
  ],
  update: [
    param("id")
      .isMongoId()
      .withMessage("Invalid question ID"),
    body("questionText")
      .optional()
      .trim()
      .isLength({ min: 3, max: 500 })
      .withMessage("Question text must be between 3 and 500 characters"),
    body("questionType")
      .optional()
      .isIn(["text", "select", "checkbox", "radio", "textarea", "number"])
      .withMessage("Invalid question type"),
    body("category")
      .optional()
      .isIn(["pose-related", "feedback", "general", "health", "session"])
      .withMessage("Invalid category"),
    body("options")
      .optional()
      .isArray()
      .withMessage("Options must be an array"),
    body("isRequired")
      .optional()
      .isBoolean()
      .withMessage("isRequired must be a boolean"),
    body("order")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Order must be a non-negative integer"),
  ],
  getById: [
    param("id")
      .isMongoId()
      .withMessage("Invalid question ID"),
  ],
  delete: [
    param("id")
      .isMongoId()
      .withMessage("Invalid question ID"),
  ],
};

/**
 * Validation rules for Response operations
 */
exports.validateResponse = {
  create: [
    body("questionId")
      .notEmpty()
      .withMessage("Question ID is required")
      .isMongoId()
      .withMessage("Invalid question ID"),
    body("responseValue")
      .notEmpty()
      .withMessage("Response value is required"),
    body("sessionId")
      .optional()
      .isString()
      .trim()
      .withMessage("Session ID must be a string"),
    body("metadata")
      .optional()
      .isObject()
      .withMessage("Metadata must be an object"),
  ],
  bulkCreate: [
    body("responses")
      .isArray({ min: 1 })
      .withMessage("Responses must be a non-empty array"),
    body("responses.*.questionId")
      .notEmpty()
      .withMessage("Question ID is required for each response")
      .isMongoId()
      .withMessage("Invalid question ID"),
    body("responses.*.responseValue")
      .notEmpty()
      .withMessage("Response value is required for each response"),
    body("sessionId")
      .optional()
      .isString()
      .trim()
      .withMessage("Session ID must be a string"),
  ],
  update: [
    param("id")
      .isMongoId()
      .withMessage("Invalid response ID"),
    body("responseValue")
      .optional()
      .notEmpty()
      .withMessage("Response value cannot be empty"),
    body("sessionId")
      .optional()
      .isString()
      .trim()
      .withMessage("Session ID must be a string"),
    body("metadata")
      .optional()
      .isObject()
      .withMessage("Metadata must be an object"),
  ],
  getById: [
    param("id")
      .isMongoId()
      .withMessage("Invalid response ID"),
  ],
  delete: [
    param("id")
      .isMongoId()
      .withMessage("Invalid response ID"),
  ],
};

/**
 * Validation rules for query parameters
 */
exports.validateQuery = {
  category: [
    query("category")
      .optional()
      .isIn(["pose-related", "feedback", "general", "health", "session"])
      .withMessage("Invalid category"),
  ],
  isActive: [
    query("isActive")
      .optional()
      .isIn(["true", "false"])
      .withMessage("isActive must be 'true' or 'false'"),
  ],
};




