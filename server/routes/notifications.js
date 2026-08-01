const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate, authorize } = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');

router.get('/', authenticate, notificationController.getNotifications);
router.get('/unread-count', authenticate, notificationController.getUnreadCount);
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { receiverId, title, message } = req.body;
    if (!title || !message) return res.status(400).json({ success: false, message: 'Title and message are required.' });
    if (receiverId) {
      await Notification.create({ receiverId, title, message });
    } else {
      const allUsers = await User.find({});
      const notifications = allUsers
        .filter(u => u._id.toString() !== req.user.id)
        .map(u => ({ receiverId: u._id, title, message }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }
    res.json({ success: true, message: 'Notification sent.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.put('/read-all', authenticate, notificationController.markAllAsRead);
router.put('/:id/read', authenticate, notificationController.markAsRead);

module.exports = router;
