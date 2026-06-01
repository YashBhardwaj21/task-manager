const prisma = require('../config/db');

const getUsers = async (query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const [users, totalRecords] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ]);

  return {
    users,
    pagination: {
      page: parseInt(page),
      limit: take,
      total: totalRecords,
      totalPages: Math.ceil(totalRecords / take)
    }
  };
};

const getTasks = async (query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  const [tasks, totalRecords] = await Promise.all([
    prisma.task.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.task.count()
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

const blockUser = async (userId) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isBlocked: true },
    select: { id: true, name: true, email: true, role: true, isBlocked: true }
  });
  return user;
};

const unblockUser = async (userId) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isBlocked: false },
    select: { id: true, name: true, email: true, role: true, isBlocked: true }
  });
  return user;
};

const deleteTask = async (taskId) => {
  const task = await prisma.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() }
  });
  return task;
};

module.exports = {
  getUsers,
  getTasks,
  blockUser,
  unblockUser,
  deleteTask
};
