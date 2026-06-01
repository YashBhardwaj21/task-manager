const express = require('express');
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');
const healthRoutes = require('./health.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/admin', adminRoutes);
router.use('/health', healthRoutes);

module.exports = router;
