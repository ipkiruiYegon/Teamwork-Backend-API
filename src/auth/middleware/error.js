const debug = require('debug')('teamwork-backend-api:debug');

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  const { statusCode, message } = err;
  if (debug) {
    res.status(statusCode || 500);
    res.json({
      status: 'error',
      error: message
    });
  } else {
    res.status(statusCode || 500);
    res.json({
      status: 'error',
      error: 'An internal error occurred while processing your request'
    });
  }
};

module.exports = {
  ErrorHandler,
  handleError
};
