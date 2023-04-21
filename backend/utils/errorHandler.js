class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message); //super is basically constructor
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;