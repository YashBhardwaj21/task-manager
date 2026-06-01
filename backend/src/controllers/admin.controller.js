const adminService = require('../services/admin.service');
const { sendResponse } = require('../utils/response');

const getUsers = async (req, res, next) => {
  try {
    const result = await adminService.getUsers(req.query);
    sendResponse(res, 200, true, 'Users fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const result = await adminService.getTasks(req.query);
    sendResponse(res, 200, true, 'Tasks fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.blockUser(id);
    sendResponse(res, 200, true, 'User blocked successfully');
  } catch (error) {
    next(error);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.unblockUser(id);
    sendResponse(res, 200, true, 'User unblocked successfully');
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteTask(id);
    sendResponse(res, 200, true, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getTasks,
  blockUser,
  unblockUser,
  deleteTask
};
