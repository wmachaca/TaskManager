const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../models/index'); // my database is in models.. future ../config/db
const Joi = require('joi');

// Test connection immediately
prisma
  .$connect()
  .then(() => console.log('✅ Prisma connected to database'))
  .catch(err => console.error('❌ Prisma connection failed:', err));

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not defined in .env');
  process.exit(1);
}

// Validation Schema
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// 🚀 Register User
exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, provider: 'credentials' },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
      },
      JWT_SECRET,
    );

    res.json({ token, userId: user.id, name: user.name });
  } catch (error) {
    console.error('Registration Error Details:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message, // Send error details to client for debugging
    });
  }
};

// 🚀 Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
      },
      JWT_SECRET,
    );

    res.json({ token, userId: user.id, name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 🚀 Google Auth Callback
exports.googleAuth = (req, res) => {
  const token = jwt.sign(
    {
      userId: req.user.id,
      name: req.user.name,
      email: req.user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    },
    JWT_SECRET,
  );
  // Use FRONTEND_URL from .env
  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    console.error('FATAL: FRONTEND_URL is not defined in .env');
    return res.status(500).json({ message: 'Server misconfiguration' });
  }

  res.redirect(`${frontendUrl}?token=${token}`);
};
