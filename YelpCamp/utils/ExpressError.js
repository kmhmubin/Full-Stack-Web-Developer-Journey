// express error handler
class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
  }
}

// export error handler
module.exports = ExpressError;
