const Response = require("../models/Response");
const Question = require("../models/Question");
const { validationResult } = require("express-validator");

/**
 * Get all responses (with optional filters)
 * GET /api/responses
 */
exports.getAllResponses = async (req, res) => {
  try {
    const { userId, questionId, sessionId } = req.query;

    const query = {};
    if (userId) query.userId = userId;
    if (questionId) query.questionId = questionId;
    if (sessionId) query.sessionId = sessionId;

    const responses = Response.find(query);

    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses,
    });
  } catch (error) {
    console.error("Get responses error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching responses",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get responses for the authenticated user
 * GET /api/responses/my-responses
 */
exports.getMyResponses = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { sessionId } = req.query;
    const query = { userId: req.user.id };
    if (sessionId) query.sessionId = sessionId;

    const responses = Response.find(query);

    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses,
    });
  } catch (error) {
    console.error("Get my responses error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching responses",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get a single response by ID
 * GET /api/responses/:id
 */
exports.getResponseById = async (req, res) => {
  try {
    const response = Response.findById(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Response not found",
      });
    }

    // Check if user owns this response or is admin (for future admin role)
    const responseUserId = typeof response.userId === "object" 
      ? response.userId.id || response.userId._id 
      : response.userId;
    if (req.user && req.user.id !== responseUserId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Get response error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching response",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Create a new response
 * POST /api/responses
 */
exports.createResponse = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { questionId, responseValue, sessionId, metadata } = req.body;

    // Verify question exists
    const question = Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Check if response already exists for this user-question-session
    const existingResponse = Response.findByUserQuestionSession(
      req.user.id,
      questionId,
      sessionId || null
    );

    let response;
    if (existingResponse) {
      // Update existing response
      response = Response.updateById(existingResponse.id, {
        responseValue,
        ...(metadata && { metadata }),
      });
    } else {
      // Create new response
      response = Response.create({
        userId: req.user.id,
        questionId,
        responseValue,
        sessionId: sessionId || null,
        metadata: metadata || {},
      });
    }

    res.status(201).json({
      success: true,
      message: "Response saved successfully",
      data: response,
    });
  } catch (error) {
    console.error("Create response error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving response",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Create multiple responses at once
 * POST /api/responses/bulk
 */
exports.createBulkResponses = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { responses, sessionId } = req.body;

    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Responses array is required",
      });
    }

    const savedResponses = [];
    const errors = [];

    for (const responseData of responses) {
      try {
        const { questionId, responseValue, metadata } = responseData;

        // Verify question exists
        const question = Question.findById(questionId);
        if (!question) {
          errors.push({
            questionId,
            error: "Question not found",
          });
          continue;
        }

        // Check if response already exists
        const existingResponse = Response.findByUserQuestionSession(
          req.user.id,
          questionId,
          sessionId || null
        );

        let response;
        if (existingResponse) {
          response = Response.updateById(existingResponse.id, {
            responseValue,
            ...(metadata && { metadata }),
          });
        } else {
          response = Response.create({
            userId: req.user.id,
            questionId,
            responseValue,
            sessionId: sessionId || undefined,
            metadata: metadata || {},
          });
        }

        savedResponses.push(response);
      } catch (error) {
        errors.push({
          questionId: responseData.questionId,
          error: error.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Saved ${savedResponses.length} response(s)`,
      count: savedResponses.length,
      data: savedResponses,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Bulk create responses error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving responses",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Update a response
 * PUT /api/responses/:id
 */
exports.updateResponse = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const response = Response.findById(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Response not found",
      });
    }

    // Check if user owns this response
    const responseUserId = typeof response.userId === "object" 
      ? response.userId.id || response.userId._id 
      : response.userId;
    if (responseUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const updatedResponse = Response.updateById(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Response updated successfully",
      data: updatedResponse,
    });
  } catch (error) {
    console.error("Update response error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating response",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Delete a response
 * DELETE /api/responses/:id
 */
exports.deleteResponse = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const response = Response.findById(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Response not found",
      });
    }

    // Check if user owns this response
    const responseUserId = typeof response.userId === "object" 
      ? response.userId.id || response.userId._id 
      : response.userId;
    if (responseUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    Response.deleteById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Response deleted successfully",
    });
  } catch (error) {
    console.error("Delete response error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting response",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
