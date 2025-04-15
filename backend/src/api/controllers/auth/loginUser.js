const { verifyPassword } = require('../../../utils/password');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../../database/client');
const { sanitizeUser } = require('../../../utils/authUtils');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET is not defined in .env');
}

module.exports = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { auth: true },
    });

    if (!user?.auth) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValid = await verifyPassword(password, user.auth.password);
    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      JWT_SECRET,
    );

    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
