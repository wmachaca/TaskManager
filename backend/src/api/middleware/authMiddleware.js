// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { prisma } = require('../../database/client');

module.exports = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get user from database and attach to request
    req.user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};
