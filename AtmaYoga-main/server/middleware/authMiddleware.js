const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Optional authentication middleware
 * Sets req.user if token is valid, but doesn't require it
 */
exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(decoded.id);

    // Remove password from user object
    if (user) {
      delete user.password;
    }

    req.user = user || null;
    next();
  } catch (err) {
    req.user = null; // if token invalid/expired, reset user
    next();
  }
};

/**
 * Required authentication middleware
 * Returns 401 if user is not authenticated
 */
exports.requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    // Remove password from user object
    delete user.password;
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};
