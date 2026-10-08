const express = require("express");
const router = express.Router();
const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");
const { validateQuestion, validateQuery } = require("../middleware/validation");
const { requireAuth } = require("../middleware/authMiddleware");

/**
 * @route   GET /api/questions
 * @desc    Get all questions (with optional filters)
 * @access  Public (can be made protected if needed)
 */
router.get(
  "/",
  validateQuery.category,
  validateQuery.isActive,
  getAllQuestions
);

/**
 * @route   GET /api/questions/:id
 * @desc    Get a single question by ID
 * @access  Public
 */
router.get("/:id", validateQuestion.getById, getQuestionById);

/**
 * @route   POST /api/questions
 * @desc    Create a new question
 * @access  Protected (Admin only - can be added later)
 */
router.post("/", requireAuth, validateQuestion.create, createQuestion);

/**
 * @route   PUT /api/questions/:id
 * @desc    Update a question
 * @access  Protected (Admin only - can be added later)
 */
router.put("/:id", requireAuth, validateQuestion.update, updateQuestion);

/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete a question (soft delete)
 * @access  Protected (Admin only - can be added later)
 */
router.delete("/:id", requireAuth, validateQuestion.delete, deleteQuestion);

module.exports = router;




