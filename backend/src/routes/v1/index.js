const express = require('express');
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');
const { sendResponse } = require('../../utils/response');

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  sendResponse(res, 200, true, "Server healthy");
});

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;
