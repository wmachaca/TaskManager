// src/utils/password.js
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  console.log('Generated Salt:', salt); // Debug log
  console.log('Generated Hash:', hash);
  return { hash, salt };
}

async function verifyPassword(candidatePassword, hash) {
  return await bcrypt.compare(candidatePassword, hash);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
