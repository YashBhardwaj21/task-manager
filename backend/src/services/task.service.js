const prisma = require('../config/db');
const { sanitizeFields } = require('../utils/sanitize');

const canAccessTask = (task, user) => {
  return user.role === 'admin' || task.userId === user.id;
};

const createTask = async (user, taskData) => {
  const sanitizedData = sanitizeFields(taskData, ['title', 'description']);
  return await prisma.task.create({
    data: {
      ...sanitizedData,
      userId: user.id
    }
  });
};

const getTasks = async (user, query) => {
  const { page = 1, limit = 10, status, priority, search } = query;
  
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {
    userId: user.id,
    deletedAt: null
  };

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [tasks, totalRecords] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.task.count({ where })
  ]);

  return {
    tasks,
    pagination: {
      page: parseInt(page),
      limit: take,
      total: totalRecords,
      totalPages: Math.ceil(totalRecords / take)
    }
  };
};

const getTaskById = async (user, taskId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!task || task.deletedAt !== null) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (!canAccessTask(task, user)) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    throw error;
  }

  return task;
};

const updateTask = async (user, taskId, updateData) => {
  await getTaskById(user, taskId);
  const sanitizedData = sanitizeFields(updateData, ['title', 'description']);
  
  return await prisma.task.update({
    where: { id: taskId },
    data: sanitizedData
  });
};

const softDeleteTask = async (user, taskId) => {
  await getTaskById(user, taskId);
  
  return await prisma.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() }
  });
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  softDeleteTask
};
