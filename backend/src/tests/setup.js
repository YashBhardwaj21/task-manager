const prisma = require('../config/db');

beforeEach(async () => {
  // Clean database before each test
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Gracefully disconnect
  await prisma.disconnectDb();
});
