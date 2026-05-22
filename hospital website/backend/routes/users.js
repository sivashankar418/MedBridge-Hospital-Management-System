const express = require('express');
const router = express.Router();
const { getUsers, getDoctors, getUserById, createUser, updateUser, deleteUser, getAnalytics } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/doctors', getDoctors);
router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.get('/', protect, authorize('admin'), getUsers);
router.post('/', protect, authorize('admin'), createUser);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
