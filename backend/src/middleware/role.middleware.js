const { sendResponse } = require('../utils/response');

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return sendResponse(res, 403, false, `Access Denied: Requires ${role} role`);
    }
    next();
  };
};

module.exports = { requireRole };
