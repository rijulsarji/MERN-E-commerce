const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // mongodb object id error: if id is less than the required bytes, it gives cast error. we'll handle that now.
  if(err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 404);
  }

  res.status(err.statusCode).json({
    success: false,
    error: {
      statusCode: err.statusCode,
      message: err.message,
    }
  })
}