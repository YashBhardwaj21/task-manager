const express = require('express');
const taskController = require('../../controllers/task.controller');
const { createTaskSchema, updateTaskSchema } = require('../../validators/task.validator');
const validate = require('../../middleware/validate.middleware');
const { authenticateToken } = require('../../middleware/auth.middleware');

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
