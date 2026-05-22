const express = require('express');
const router = express.Router();
const { getLabTests, getLabTestById, createLabTest, updateLabTest, deleteLabTest } = require('../controllers/labTestController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getLabTests);
router.get('/:id', getLabTestById);
router.post('/', protect, authorize('admin'), createLabTest);
router.put('/:id', protect, authorize('admin'), updateLabTest);
router.delete('/:id', protect, authorize('admin'), deleteLabTest);

module.exports = router;
