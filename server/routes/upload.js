const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    console.log('[UPLOAD] req.file:', JSON.stringify(req.file, null, 2));
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const imageUrl = req.file.path;
    console.log('[UPLOAD] imageUrl:', imageUrl);
    console.log('[UPLOAD] typeof imageUrl:', typeof imageUrl);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: imageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: { profileImage: imageUrl }, message: 'Profile image updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
