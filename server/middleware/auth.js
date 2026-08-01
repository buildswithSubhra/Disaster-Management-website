const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/helpers');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided. Authorization denied.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Token is not valid. User not found.' });
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is not valid.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Role '${req.user.role}' is not authorized to access this resource.` });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
