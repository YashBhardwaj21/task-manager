const taskService = require('../services/task.service');
const { sendResponse } = require('../utils/response');

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    sendResponse(res, 201, true, 'Task created successfully', { task });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.user.id, req.query);
    sendResponse(res, 200, true, 'Tasks fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.user.id, req.params.id);
    sendResponse(res, 200, true, 'Task fetched successfully', { task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    sendResponse(res, 200, true, 'Task updated successfully', { task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.softDeleteTask(req.user.id, req.params.id);
    sendResponse(res, 200, true, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
