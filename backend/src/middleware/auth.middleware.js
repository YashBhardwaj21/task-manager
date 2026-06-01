const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/response');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendResponse(res, 401, false, "Access Denied: No token provided");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return sendResponse(res, 401, false, "Access Denied: Invalid or expired token");
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
