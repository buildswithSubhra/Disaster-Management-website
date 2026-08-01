const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { unreadOnly, page = 1, limit = 20 } = req.query;

    const filter = { receiverId: req.user.id };
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Notification.countDocuments(filter),
      Notification.countDocuments({ receiverId: req.user.id, isRead: false })
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        total,
        unreadCount,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    if (notif.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    notif.isRead = true;
    await notif.save();

    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { receiverId: req.user.id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true, message: `${result.modifiedCount} notifications marked as read.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ receiverId: req.user.id, isRead: false });
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
