const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ receiverId: 1, createdAt: -1 });
notificationSchema.index({ receiverId: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
