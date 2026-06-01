const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTask = async (userId, taskData) => {
  return await prisma.task.create({
    data: {
      ...taskData,
      userId
    }
  });
};

const getTasks = async (userId, query) => {
  const { page = 1, limit = 10, status, priority, search } = query;
  
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const where = {
    userId,
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
    page: parseInt(page),
    totalPages: Math.ceil(totalRecords / take),
    totalRecords
  };
};

const getTaskById = async (userId, taskId) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId, deletedAt: null }
  });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  return task;
};

const updateTask = async (userId, taskId, updateData) => {
  await getTaskById(userId, taskId); // Checks ownership and existence
  
  return await prisma.task.update({
    where: { id: taskId },
    data: updateData
  });
};

const softDeleteTask = async (userId, taskId) => {
  await getTaskById(userId, taskId); // Checks ownership and existence
  
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
