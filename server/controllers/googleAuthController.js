const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
  try {
    const { credential, role } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required.' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with this email
      user = await User.findOne({ email });

      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.authProvider = 'google';
        if (picture && !user.profileImage) {
          user.profileImage = picture;
        }
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          name,
          email,
          googleId,
          authProvider: 'google',
          profileImage: picture || '',
          phone: '',
          role: role || 'user',
          address: ''
        });
      }
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Google authentication successful.',
      data: { user: user.toJSON(), token }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Google authentication failed.', error: error.message });
  }
};
