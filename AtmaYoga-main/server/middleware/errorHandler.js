/**
 * Global error handler middleware
 * Should be used as the last middleware in the Express app
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("Error:", err);

  // SQLite constraint errors
  if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 };
  }

  if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
    const message = "Referenced resource not found";
    error = { message, statusCode: 400 };
  }

  // Validation errors
  if (err.name === "ValidationError") {
    const message = err.message || "Validation error";
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;

