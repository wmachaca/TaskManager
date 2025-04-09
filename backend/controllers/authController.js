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
  try {
    // Verify we have a valid user object
    if (!req.user || !req.user.id) {
      console.error('GoogleAuth: Invalid user object', req.user);
      throw new Error('Invalid user data from Google authentication');
    }

    // Create JWT token with additional useful claims
    const token = jwt.sign(
      {
        userId: req.user.id,
        name: req.user.name,
        email: req.user.email,
        provider: req.user.provider || 'google', // Include auth provider
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 24 hour expiration
      },
      JWT_SECRET,
      { algorithm: 'HS256' }, // Explicit algorithm
    );

    // Validate frontend URL
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      console.error('FATAL: FRONTEND_URL is not defined in .env');
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    // Construct redirect URL with additional safety checks
    const redirectUrl = new URL(`${frontendUrl}/tasks`);
    redirectUrl.searchParams.set('token', token);

    // Add secure cookie with HttpOnly flag (optional but recommended)
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 * 1000, // 24 hours
    });

    // Perform the redirect
    console.log(`Redirecting to: ${redirectUrl.toString()}`);
    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('GoogleAuth error:', error);
    return res.status(500).json({
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
