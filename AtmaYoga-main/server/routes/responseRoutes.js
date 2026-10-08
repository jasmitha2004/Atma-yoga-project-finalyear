const express = require("express");
const router = express.Router();
const {
  getAllResponses,
  getMyResponses,
  getResponseById,
  createResponse,
  createBulkResponses,
  updateResponse,
  deleteResponse,
} = require("../controllers/responseController");
const { validateResponse } = require("../middleware/validation");
const { requireAuth } = require("../middleware/authMiddleware");

/**
 * @route   GET /api/responses
 * @desc    Get all responses (with optional filters)
 * @access  Protected (Admin only - can be added later)
 */
router.get("/", requireAuth, getAllResponses);

/**
 * @route   GET /api/responses/my-responses
 * @desc    Get responses for the authenticated user
 * @access  Protected
 */
router.get("/my-responses", requireAuth, getMyResponses);

/**
 * @route   GET /api/responses/:id
 * @desc    Get a single response by ID
 * @access  Protected
 */
router.get("/:id", requireAuth, validateResponse.getById, getResponseById);

/**
 * @route   POST /api/responses
 * @desc    Create a new response
 * @access  Protected
 */
router.post("/", requireAuth, validateResponse.create, createResponse);

/**
 * @route   POST /api/responses/bulk
 * @desc    Create multiple responses at once
 * @access  Protected
 */
router.post("/bulk", requireAuth, validateResponse.bulkCreate, createBulkResponses);

/**
 * @route   PUT /api/responses/:id
 * @desc    Update a response
 * @access  Protected
 */
router.put("/:id", requireAuth, validateResponse.update, updateResponse);

/**
 * @route   DELETE /api/responses/:id
 * @desc    Delete a response
 * @access  Protected
 */
router.delete("/:id", requireAuth, validateResponse.delete, deleteResponse);

module.exports = router;




