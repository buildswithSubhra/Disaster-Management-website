const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    await Contact.create({ name, email, subject, message });
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
