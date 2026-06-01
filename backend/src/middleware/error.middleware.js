const logger = require('../utils/logger');
const { sendResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  sendResponse(res, statusCode, false, message);
};

module.exports = { errorHandler };
