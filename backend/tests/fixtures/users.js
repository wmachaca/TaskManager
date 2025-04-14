// tests/fixtures/users.js
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

module.exports = {
  validUser: {
    name: 'Test User',
    email: 'test@example.com',
    provider: 'credentials',
    auth: {
      password: bcrypt.hashSync('testpassword', SALT_ROUNDS), // Real hash
      salt: 'some-salt',
    },
  },

  invalidUser: {
    email: 'invalid-email',
    password: '123',
  },

  googleUser: {
    name: 'Google user',
    email: 'google@example.com',
    provider: 'google',
    googleId: '123456789',
  },
};
