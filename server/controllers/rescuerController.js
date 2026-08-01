const Rescuer = require('../models/Rescuer');
const Disaster = require('../models/Disaster');
const Notification = require('../models/Notification');

exports.getAllRescuers = async (req, res) => {
  try {
    const { search, availability, skill, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (availability) filter.availability = availability;
    if (skill) filter.skills = { $in: [skill] };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [rescuers, total] = await Promise.all([
      Rescuer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Rescuer.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        rescuers,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRescuerProfile = async (req, res) => {
  try {
    const rescuer = await Rescuer.findOne({ userId: req.user.id });
    if (!rescuer) {
      return res.status(404).json({ success: false, message: 'Rescuer profile not found.' });
    }
    res.json({ success: true, data: rescuer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    if (!availability) {
      return res.status(400).json({ success: false, message: 'Availability status is required.' });
    }

    const rescuer = await Rescuer.findOne({ userId: req.user.id });
    if (!rescuer) {
      return res.status(404).json({ success: false, message: 'Rescuer not found.' });
    }

    const updated = await Rescuer.findByIdAndUpdate(rescuer._id, { availability }, { new: true });
    res.json({ success: true, message: 'Availability updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const rescuer = await Rescuer.findOne({ userId: req.user.id });
    if (!rescuer) {
      return res.status(404).json({ success: false, message: 'Rescuer not found.' });
    }

    const updated = await Rescuer.findByIdAndUpdate(
      rescuer._id,
      { currentLocation: { lat: lat || 0, lng: lng || 0 } },
      { new: true }
    );
    res.json({ success: true, message: 'Location updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAssignedMissions = async (req, res) => {
  try {
    const rescuer = await Rescuer.findOne({ userId: req.user.id });
    if (!rescuer) {
      return res.status(404).json({ success: false, message: 'Rescuer not found.' });
    }

    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = { assignedRescuer: rescuer._id };
    if (status) filter.status = status;

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

exports.updateMissionProgress = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const rescuer = await Rescuer.findOne({ userId: req.user.id });
    if (!rescuer) {
      return res.status(404).json({ success: false, message: 'Rescuer not found.' });
    }

    const disaster = await Disaster.findById(req.params.id);
    if (!disaster) {
      return res.status(404).json({ success: false, message: 'Disaster not found.' });
    }

    if (disaster.assignedRescuer.toString() !== rescuer._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this mission.' });
    }

    const updated = await Disaster.findByIdAndUpdate(req.params.id, { status }, { new: true });

    await Notification.create({
      receiverId: disaster.userId,
      title: 'Mission Progress Update',
      message: `Your report "${disaster.title}" is now: ${status}.`
    });

    if (status === 'Completed' || status === 'Rescued') {
      const currentRescuer = await Rescuer.findById(rescuer._id);
      const activeCases = currentRescuer.assignedCases.filter(c => c.toString() !== req.params.id);
      await Rescuer.findByIdAndUpdate(rescuer._id, {
        assignedCases: activeCases,
        availability: activeCases.length > 0 ? 'Busy' : 'Available'
      });
    }

    res.json({ success: true, message: 'Mission progress updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createRescuer = async (req, res) => {
  try {
    const { name, email, phone, skills, userId, currentLocation } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const existing = await Rescuer.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Rescuer with this email already exists.' });
    }

    const rescuer = await Rescuer.create({
      userId: userId || null,
      name,
      email,
      phone: phone || '',
      skills: skills || [],
      currentLocation: currentLocation || { lat: 0, lng: 0 }
    });

    res.status(201).json({ success: true, message: 'Rescuer created successfully.', data: rescuer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateRescuer = async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'phone', 'availability', 'skills', 'currentLocation', 'assignedCases', 'userId'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const rescuer = await Rescuer.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!rescuer) {
      return res.status(404).json({ success: false, message: 'Rescuer not found.' });
    }
    res.json({ success: true, message: 'Rescuer updated.', data: rescuer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteRescuer = async (req, res) => {
  try {
    const rescuer = await Rescuer.findByIdAndDelete(req.params.id);
    if (!rescuer) {
      return res.status(404).json({ success: false, message: 'Rescuer not found.' });
    }
    res.json({ success: true, message: 'Rescuer deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
