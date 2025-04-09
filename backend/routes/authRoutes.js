const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

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
  authController.googleAuth,
);

module.exports = router;
