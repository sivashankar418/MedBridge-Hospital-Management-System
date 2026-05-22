const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadReport, getMyReports, getAllReports, deleteReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', protect, authorize('admin'), upload.single('file'), uploadReport);
router.get('/my', protect, authorize('patient'), getMyReports);
router.get('/', protect, authorize('admin', 'doctor'), getAllReports);
router.delete('/:id', protect, authorize('admin'), deleteReport);

module.exports = router;
