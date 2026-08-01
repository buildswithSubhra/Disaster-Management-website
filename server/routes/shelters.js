const express = require('express');
const router = express.Router();
const shelterController = require('../controllers/shelterController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/nearby', shelterController.getNearbyShelters);
router.get('/', shelterController.getAllShelters);
router.get('/:id', shelterController.getShelterById);
router.post('/', authenticate, authorize('admin'), shelterController.createShelter);
router.put('/:id', authenticate, authorize('admin'), shelterController.updateShelter);
router.delete('/:id', authenticate, authorize('admin'), shelterController.deleteShelter);

module.exports = router;
