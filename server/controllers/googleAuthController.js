const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const { initializeApp, cert, getApps } = require('firebase-admin');

if (!getApps().length) {
  let serviceAccount;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
  }
  initializeApp({ credential: cert(serviceAccount) });
}

const { getAuth } = require('firebase-admin/auth');

exports.googleAuth = async (req, res) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Firebase ID token is required.' });
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);
    const { uid: firebaseUid, email, name, picture } = decodedToken;

    let user = await User.findOne({ googleId: firebaseUid });

    if (!user) {
      user = await User.findOne({ email });

      if (user) {
        user.googleId = firebaseUid;
        user.authProvider = 'firebase';
        if (picture && !user.profileImage) {
          user.profileImage = picture;
        }
        await user.save();
      } else {
        user = await User.create({
          name: name || email?.split('@')[0] || 'User',
          email,
          googleId: firebaseUid,
          authProvider: 'firebase',
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
      message: 'Firebase authentication successful.',
      data: { user: user.toJSON(), token }
    });
  } catch (error) {
    console.error('Firebase auth error:', error);
    res.status(500).json({ success: false, message: 'Firebase authentication failed.', error: error.message });
  }
};
