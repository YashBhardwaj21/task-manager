const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sanitizeFields } = require('../utils/sanitize');

const registerUser = async (userData) => {
  const { name: rawName, email, password } = userData;
  const { name } = sanitizeFields({ name: rawName }, ['name']);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'user'  // Hardcoded — admins are created only via seed script
    }
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  if (user.isBlocked) {
    const error = new Error('User account is blocked');
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const payload = { id: user.id, role: user.role };
  
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  };
};

const refreshAccessToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    if (user.isBlocked) {
      const error = new Error('User account is blocked');
      error.statusCode = 403;
      throw error;
    }

    const payload = { id: user.id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });

    return { accessToken, refreshToken };
  } catch (error) {
    error.statusCode = 401;
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken
};
