//configure passport.js for google login
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { HttpsProxyAgent } = require('https-proxy-agent');
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const agent = proxy ? new HttpsProxyAgent(proxy) : null;

const { prisma } = require('../models/index'); // it is in ./models/index.js ... ./db for future
const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const options = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
  passReqToCallback: true,
};

const strategy = new GoogleStrategy(
  options,
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('Looking for user with email:', profile.emails[0].value);

      if (!prisma) throw new Error('Prisma client not initialized');

      const { id, displayName, emails } = profile;
      if (!emails || !emails[0]) throw new Error('No email found in Google profile');
      const email = emails[0].value;

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: displayName,
            email,
            googleId: id,
            provider: 'google',
            password: null,
          },
        });
      } else if (user.provider === 'credentials') {
        return done(null, false, {
          message: 'This email is already registered with email/password',
        });
      } else if (!user.googleId) {
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
);

if (agent) {
  // Only set proxy agent if needed (Linux behind proxy)
  strategy._oauth2.setAgent(agent);
  console.log('Using proxy agent for Google OAuth');
} else {
  console.log('No proxy detected — running without agent');
}

passport.use(strategy);

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
