const { hashPassword } = require('../../../utils/password');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../../database/client');
const Joi = require('joi');
const { PUBLIC_USER_FIELDS } = require('../../../utils/authUtils');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET is not defined in .env');
}

// Validation Schema
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const { hash, salt } = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        provider: 'credentials',
        auth: {
          create: {
            password: hash,
            salt,
          },
        },
      },
      select: PUBLIC_USER_FIELDS,
    });

    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      JWT_SECRET,
    );

    res.status(201).json({ token, user }); //res.json({ token, user });
  } catch (error) {
    console.error('Registration Error Details:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};
