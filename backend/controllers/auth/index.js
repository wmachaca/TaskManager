// controllers/auth/index.js
const registerUser = require('./registerUser');
const loginUser = require('./loginUser');
const googleAuth = require('./googleAuth');

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
};
