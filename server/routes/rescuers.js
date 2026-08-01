const express = require('express');
const router = express.Router();
const rescuerController = require('../controllers/rescuerController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/profile', authenticate, authorize('rescuer'), rescuerController.getRescuerProfile);
router.put('/availability', authenticate, authorize('rescuer'), rescuerController.updateAvailability);
router.put('/location', authenticate, authorize('rescuer'), rescuerController.updateLocation);
router.get('/missions', authenticate, authorize('rescuer'), rescuerController.getAssignedMissions);
router.put('/missions/:id/progress', authenticate, authorize('rescuer'), rescuerController.updateMissionProgress);

router.get('/', authenticate, authorize('admin'), rescuerController.getAllRescuers);
router.post('/', authenticate, authorize('admin'), rescuerController.createRescuer);
router.put('/:id', authenticate, authorize('admin'), rescuerController.updateRescuer);
router.delete('/:id', authenticate, authorize('admin'), rescuerController.deleteRescuer);

module.exports = router;
