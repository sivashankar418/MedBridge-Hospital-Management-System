const express = require('express');
const router = express.Router();
const { createAppointment, getMyAppointments, getAllAppointments, getPrescriptions, updateAppointment, submitPrescription, updatePrescriptionStatus, deleteAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('patient'), createAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/prescriptions', protect, authorize('pharmacist', 'admin'), getPrescriptions);
router.get('/', protect, authorize('admin'), getAllAppointments);
router.put('/:id', protect, updateAppointment);
router.post('/:id/submit-prescription', protect, authorize('doctor'), submitPrescription);
router.put('/:id/prescription-status', protect, authorize('pharmacist'), updatePrescriptionStatus);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
