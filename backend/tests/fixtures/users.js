// tests/fixtures/users.js
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

module.exports = {
  registration: {
    valid: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!',
    },
    invalid: {
      email: 'bad-email',
      password: '123',
    },
  },
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
};
