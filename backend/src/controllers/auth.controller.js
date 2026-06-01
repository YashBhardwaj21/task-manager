const authService = require('../services/auth.service');
const { sendResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    sendResponse(res, 201, true, 'User registered successfully', { user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    sendResponse(res, 200, true, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    sendResponse(res, 200, true, 'Access token refreshed', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh
};
