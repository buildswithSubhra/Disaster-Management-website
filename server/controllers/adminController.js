const User = require('../models/User');
const Disaster = require('../models/Disaster');
const Rescuer = require('../models/Rescuer');
const Shelter = require('../models/Shelter');
const Notification = require('../models/Notification');

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDisasters,
      totalRescuers,
      totalShelters,
      totalNotifications,
      availableRescuers,
      disasterStats
    ] = await Promise.all([
      User.countDocuments(),
      Disaster.countDocuments(),
      Rescuer.countDocuments(),
      Shelter.countDocuments(),
      Notification.countDocuments(),
      Rescuer.countDocuments({ availability: 'Available' }),
      Disaster.aggregate([
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
      ])
    ]);

    const stats = disasterStats[0] || { total: 0, pending: 0, assigned: 0, inProgress: 0, rescued: 0, completed: 0, totalPeopleAffected: 0 };
    delete stats._id;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDisasters,
        totalRescuers,
        totalShelters,
        totalNotifications,
        availableRescuers,
        disasters: stats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) filter.role = role;
    if (status) filter.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        users,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, message: `User ${status}.`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin user.' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const [disasters, users, monthlyReports, disasterByType, disasterBySeverity, statusCounts] = await Promise.all([
      Disaster.find().sort({ createdAt: -1 }),
      User.find(),
      Disaster.aggregate([
        {
          $group: {
            _id: { $substr: ['$createdAt', 0, 7] },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Disaster.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Disaster.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]),
      Disaster.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const monthlyReportsObj = {};
    monthlyReports.forEach(item => { monthlyReportsObj[item._id] = item.count; });

    const disasterByTypeObj = {};
    disasterByType.forEach(item => { disasterByTypeObj[item._id] = item.count; });

    const disasterBySeverityObj = {};
    disasterBySeverity.forEach(item => { disasterBySeverityObj[item._id] = item.count; });

    const statusCountsObj = {};
    statusCounts.forEach(item => { statusCountsObj[item._id] = item.count; });

    const completedCount = statusCountsObj['Completed'] || 0;
    const rescuedCount = statusCountsObj['Rescued'] || 0;
    const resolvedCount = completedCount + rescuedCount;
    const rescueCompletionRate = disasters.length > 0
      ? ((resolvedCount / disasters.length) * 100).toFixed(1)
      : 0;

    const usersByRole = {};
    users.forEach(u => {
      usersByRole[u.role] = (usersByRole[u.role] || 0) + 1;
    });

    const recentDisasters = disasters.slice(0, 5);

    res.json({
      success: true,
      data: {
        monthlyReports: monthlyReportsObj,
        disasterByType: disasterByTypeObj,
        disasterBySeverity: disasterBySeverityObj,
        rescueCompletionRate: parseFloat(rescueCompletionRate),
        totalDisasters: disasters.length,
        resolvedDisasters: resolvedCount,
        usersByRole,
        recentDisasters
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
