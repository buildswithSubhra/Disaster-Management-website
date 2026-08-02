const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const disasterController = require('../controllers/disasterController');
const { authenticate, authorize } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'reliefops/disasters',
    format: 'jpg',
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'heic', 'heif'],
  },
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
