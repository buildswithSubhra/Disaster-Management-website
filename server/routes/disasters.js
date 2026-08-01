const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const disasterController = require('../controllers/disasterController');
const { authenticate, authorize } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => { if (file.mimetype.startsWith('image/')) cb(null, true); else cb(new Error('Only image files allowed.')); } });

router.post('/', authenticate, upload.single('image'), disasterController.createDisaster);
router.get('/my', authenticate, disasterController.getMyDisasters);
router.get('/stats/dashboard', authenticate, authorize('admin'), disasterController.getDisasterStats);
router.get('/', authenticate, disasterController.getAllDisasters);
router.get('/:id', authenticate, disasterController.getDisasterById);
router.put('/:id/status', authenticate, authorize('admin'), disasterController.updateDisasterStatus);
router.put('/:id/assign', authenticate, authorize('admin'), disasterController.assignRescuer);
router.delete('/:id', authenticate, authorize('admin'), disasterController.deleteDisaster);

module.exports = router;
