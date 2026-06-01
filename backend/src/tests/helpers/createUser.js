const bcrypt = require('bcrypt');
const crypto = require('crypto');
const prisma = require('../../config/db');

const createUser = async ({ email = `user-${crypto.randomUUID()}@test.com`, password = "Password123", name = "Test User", role = "user" } = {}) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role
    }
  });
};

module.exports = { createUser };
