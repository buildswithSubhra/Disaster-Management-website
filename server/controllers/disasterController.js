const Disaster = require('../models/Disaster');
const Rescuer = require('../models/Rescuer');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createDisaster = async (req, res) => {
  try {
    const { title, type, description, severity, latitude, longitude, address, peopleAffected, emergencyContact } = req.body;

    if (!title || !type) {
      return res.status(400).json({ success: false, message: 'Title and type are required.' });
    }

    const disaster = await Disaster.create({
      userId: req.user.id,
      title,
      type,
      description,
      severity: severity || 'Medium',
      latitude: latitude || 0,
      longitude: longitude || 0,
      address: address || '',
      peopleAffected: peopleAffected || 0,
      emergencyContact: emergencyContact || '',
      image: req.file ? req.file.path : ''
    });

    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map(admin => ({
      receiverId: admin._id,
      title: 'New Disaster Report',
      message: `New ${type} disaster reported: ${title}`
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, message: 'Disaster report created successfully.', data: disaster });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllDisasters = async (req, res) => {
  try {
    const { search, type, severity, status, userId, assignedRescuer, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (assignedRescuer) filter.assignedRescuer = assignedRescuer;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [disasters, total] = await Promise.all([
      Disaster.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Disaster.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        disasters,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyDisasters = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = { userId: req.user.id };
    const [disasters, total] = await Promise.all([
      Disaster.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Disaster.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        disasters,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDisasterById = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id).populate('assignedRescuer');
    if (!disaster) {
      return res.status(404).json({ success: false, message: 'Disaster not found.' });
    }
    res.json({ success: true, data: disaster });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateDisasterStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const disaster = await Disaster.findById(req.params.id);
    if (!disaster) {
      return res.status(404).json({ success: false, message: 'Disaster not found.' });
    }

    const updated = await Disaster.findByIdAndUpdate(req.params.id, { status }, { new: true });

    await Notification.create({
      receiverId: disaster.userId,
      title: 'Disaster Status Updated',
      message: `Your report "${disaster.title}" status has been updated to ${status}.`
    });

    if (disaster.assignedRescuer) {
      const rescuer = await Rescuer.findById(disaster.assignedRescuer);
      if (rescuer) {
        await Notification.create({
          receiverId: rescuer.userId,
          title: 'Mission Status Updated',
          message: `Disaster "${disaster.title}" status updated to ${status}.`
        });
      }
    }

    res.json({ success: true, message: 'Disaster status updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.assignRescuer = async (req, res) => {
  try {
    const { rescuerId } = req.body;
    if (!rescuerId) {
      return res.status(400).json({ success: false, message: 'Rescuer ID is required.' });
    }

    const disaster = await Disaster.findById(req.params.id);
    if (!disaster) {
      return res.status(404).json({ success: false, message: 'Disaster not found.' });
    }

    const rescuer = await Rescuer.findById(rescuerId);
    if (!rescuer) {
      return res.status(404).json({ success: false, message: 'Rescuer not found.' });
    }

    const updated = await Disaster.findByIdAndUpdate(
      req.params.id,
      { assignedRescuer: rescuerId, status: 'Assigned' },
      { new: true }
    );

    await Rescuer.findByIdAndUpdate(rescuerId, {
      $push: { assignedCases: disaster._id },
      availability: 'Busy'
    });

    await Notification.create({
      receiverId: disaster.userId,
      title: 'Rescuer Assigned',
      message: `Rescuer "${rescuer.name}" has been assigned to your report "${disaster.title}".`
    });

    if (rescuer.userId) {
      await Notification.create({
        receiverId: rescuer.userId,
        title: 'New Mission Assigned',
        message: `You have been assigned to disaster: "${disaster.title}".`
      });
    }

    res.json({ success: true, message: 'Rescuer assigned successfully.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDisasterStats = async (req, res) => {
  try {
    const stats = await Disaster.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          assigned: { $sum: { $cond: [{ $eq: ['$status', 'Assigned'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
          rescued: { $sum: { $cond: [{ $eq: ['$status', 'Rescued'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          totalPeopleAffected: { $sum: '$peopleAffected' }
        }
      }
    ]);

    const byType = await Disaster.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const bySeverity = await Disaster.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    const result = stats[0] || { total: 0, pending: 0, assigned: 0, inProgress: 0, rescued: 0, completed: 0, totalPeopleAffected: 0 };
    result.byType = {};
    byType.forEach(item => { result.byType[item._id] = item.count; });
    result.bySeverity = {};
    bySeverity.forEach(item => { result.bySeverity[item._id] = item.count; });

    delete result._id;

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findByIdAndDelete(req.params.id);
    if (!disaster) {
      return res.status(404).json({ success: false, message: 'Disaster not found.' });
    }
    res.json({ success: true, message: 'Disaster deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
