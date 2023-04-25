const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // mongodb object id error: if id is less than the required bytes, it gives cast error. we'll handle that now. basically for wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 404);
  }

  // mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 500);
  }

  // wrong jwt error
  if (err.code === "JsonWebTokenError") {
    const message = `JsonWebToken is invalid. Please try again`;
    err = new ErrorHandler(message, 500);
  }

  // jwt expire error
  if (err.code === "TokenExpiredError") {
    const message = `JsonWebToken is expired. Please try again`;
    err = new ErrorHandler(message, 500);
  }

  res.status(err.statusCode).json({
    success: false,
    error: {
      statusCode: err.statusCode,
      message: err.message,
    },
  });
};
