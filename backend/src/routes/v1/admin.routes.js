const express = require('express');
const adminController = require('../../controllers/admin.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');

const router = express.Router();

router.get('/users', authenticateToken, requireRole('admin'), adminController.getUsers);
router.get('/tasks', authenticateToken, requireRole('admin'), adminController.getTasks);
router.patch('/users/:id/block', authenticateToken, requireRole('admin'), adminController.blockUser);
router.patch('/users/:id/unblock', authenticateToken, requireRole('admin'), adminController.unblockUser);
router.delete('/tasks/:id', authenticateToken, requireRole('admin'), adminController.deleteTask);

module.exports = router;
