const { prisma } = require('../src/database/client');
const userFixtures = require('./fixtures/users');
const taskFixtures = require('./fixtures/tasks');

// Clean database
const cleanDatabase = async () => {
  await prisma.task.deleteMany();
  await prisma.userAuth.deleteMany();
  await prisma.user.deleteMany();
};

// Create valid test user
const createTestUser = async (userData = userFixtures.validUser) => {
  return prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      provider: userData.provider,
      auth: {
        create: {
          password: userData.auth.password,
          salt: userData.auth.salt,
        },
      },
    },
  });
};

// getToken
const getAuthToken = async app => {
  const res = await require('supertest')(app).post('/api/auth/login').send({
    email: 'test@example.com',
    password: 'testpassword', // Raw password that matches the hash
  });
  return res.body.token;
};

module.exports = {
  prisma,
  cleanDatabase,
  createTestUser,
  getAuthToken,
  fixtures: {
    users: userFixtures,
    tasks: taskFixtures,
  },
};
