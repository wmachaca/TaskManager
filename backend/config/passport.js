//configure passport.js for google login
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { prisma } = require('../models/index'); // it is in ./models/index.js ... ./db for future
const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log('Looking for user with email:', profile.emails[0].value); // Debug log

        // First check if prisma is available
        if (!prisma) {
          throw new Error('Prisma client not initialized');
        }

        // Extract user data from Google profile
        const { id, displayName, emails } = profile;
        if (!emails || !emails[0]) {
          throw new Error('No email found in Google profile');
        }
        const email = emails[0].value;

        // Check if user exists in database
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          // Create new user if doesn't exist
          user = await prisma.user.create({
            data: {
              name: displayName,
              email,
              googleId: id,
              provider: 'google',
              password: null, // No password for Google users
            },
          });
        } else if (user.provider === 'credentials') {
          // If user exists but registered with email/password
          return done(null, false, {
            message: 'This email is already registered with email/password',
          });
        } else if (!user.googleId) {
          // Update existing user with Google ID if missing
          user = await prisma.user.update({
            where: { email },
            data: { googleId: id, provider: 'google' },
          });
        }
        return done(null, user);
      } catch (error) {
        console.error('Passport verification error:', error);
        return done(error, null);
      }
    },
  ),
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
module.exports = passport;
