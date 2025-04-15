const express = require('express');
const passport = require('passport');
const { registerUser, loginUser, googleAuth } = require('../controllers/auth/index');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Google authentication routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false, // We're using JWT, not sessions
  }),
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login', // Or your frontend login page
    session: false,
  }),
  googleAuth,
);

module.exports = router;
