const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
