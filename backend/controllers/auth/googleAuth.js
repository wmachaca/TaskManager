const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET is not defined in .env');
}

module.exports = (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('GoogleAuth: Invalid user object', req.user);
      throw new Error('Invalid user data from Google authentication');
    }

    const token = jwt.sign(
      {
        userId: req.user.id,
        name: req.user.name,
        email: req.user.email,
        provider: req.user.provider || 'google',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      JWT_SECRET,
      { algorithm: 'HS256' },
    );

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      console.error('FATAL: FRONTEND_URL is not defined in .env');
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    // Construct redirect URL with additional safety checks
    const redirectUrl = new URL(`${frontendUrl}/tasks`);
    redirectUrl.searchParams.set('token', token);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 * 1000,
    });

    console.log(`Redirecting to: ${redirectUrl.toString()}`);
    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('GoogleAuth error:', error);
    return res.status(500).json({
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
