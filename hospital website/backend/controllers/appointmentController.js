const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc  Create appointment
const createAppointment = async (req, res) => {
  try {
    const { doctor, date, timeSlot, reason } = req.body;
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      date,
      timeSlot,
      reason,
    });
    await appointment.populate(['patient', 'doctor']);
    await Notification.create({
      user: doctor,
      title: 'New Appointment Request',
      message: `${appointment.patient.name} has booked an appointment on ${new Date(date).toDateString()} at ${timeSlot}`,
      type: 'appointment',
      link: '/doctor/appointments',
    });
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get appointments for logged-in user
const getMyAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = req.user.role === 'patient' ? { patient: req.user.id } : { doctor: req.user.id };
    if (status) query.status = status;

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all appointments (admin)
const getAllAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, pages: Math.ceil(total / limit), appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all prescriptions (admin/pharmacist)
const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Appointment.find({ prescriptionSubmitted: true })
      .populate('patient', 'name email phone address')
      .populate('doctor', 'name specialization')
      .sort({ updatedAt: -1 });
    res.json({ success: true, prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update appointment (save prescription as draft, update notes/status)
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(['patient', 'doctor']);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const { status, notes, prescription, prescriptionItems, feedback } = req.body;
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (prescription) appointment.prescription = prescription;
    if (feedback) appointment.feedback = feedback;
    
    // Save prescription items but don't mark as submitted yet
    if (Array.isArray(prescriptionItems) && prescriptionItems.length > 0) {
      appointment.prescriptionItems = prescriptionItems;
    }
    
    await appointment.save();

    if (status) {
      await Notification.create({
        user: appointment.patient._id,
        title: 'Appointment Update',
        message: `Your appointment on ${new Date(appointment.date).toDateString()} has been ${status}`,
        type: 'appointment',
        link: '/patient/appointments',
      });
    }
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Submit prescription (finalize and notify)
const submitPrescription = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(['patient', 'doctor']);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    appointment.prescriptionSubmitted = true;
    appointment.prescriptionStatus = 'pending';
    await appointment.save();

    // Notify patient
    await Notification.create({
      user: appointment.patient._id,
      title: 'New Prescription Available',
      message: `Your doctor has submitted a prescription for your appointment on ${new Date(appointment.date).toDateString()}`,
      type: 'prescription',
      link: '/patient/appointments',
    });
    
    // Notify all pharmacists
    const pharmacists = await User.find({ role: 'pharmacist' });
    await Promise.all(pharmacists.map(pharmacist => Notification.create({
      user: pharmacist._id,
      title: 'New Prescription Received',
      message: `A new prescription for ${appointment.patient.name} is ready to process`,
      type: 'prescription',
      link: '/store/prescriptions',
    })));
    
    // Notify admin
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      await Notification.create({
        user: adminUser._id,
        title: 'Prescription Submitted',
        message: `Prescription submitted by Dr. ${appointment.doctor.name} for ${appointment.patient.name}`,
        type: 'prescription',
        link: '/admin/prescriptions',
      });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update prescription status (pharmacist updates status)
const updatePrescriptionStatus = async (req, res) => {
  try {
    const { prescriptionStatus } = req.body;
    const validStatuses = ['pending', 'approved', 'ready_for_delivery', 'delivered'];
    
    if (!validStatuses.includes(prescriptionStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id).populate(['patient', 'doctor']);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (!appointment.prescriptionSubmitted) {
      return res.status(400).json({ success: false, message: 'No prescription submitted for this appointment' });
    }

    const oldStatus = appointment.prescriptionStatus;
    appointment.prescriptionStatus = prescriptionStatus;
    await appointment.save();

    // Notify patient about status change
    const statusMessages = {
      approved: 'Your prescription has been approved by the pharmacy',
      ready_for_delivery: 'Your medicine is ready for delivery',
      delivered: 'Your medicine has been delivered',
    };

    if (prescriptionStatus !== 'pending') {
      await Notification.create({
        user: appointment.patient._id,
        title: 'Prescription Status Updated',
        message: statusMessages[prescriptionStatus] || `Prescription status updated to ${prescriptionStatus}`,
        type: 'prescription',
        link: '/patient/appointments',
      });
    }

    // Notify admin about status change
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      await Notification.create({
        user: adminUser._id,
        title: 'Prescription Status Updated',
        message: `Prescription for ${appointment.patient.name} status: ${oldStatus} → ${prescriptionStatus}`,
        type: 'prescription',
        link: '/admin/prescriptions',
      });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createAppointment, getMyAppointments, getAllAppointments, getPrescriptions, updateAppointment, submitPrescription, updatePrescriptionStatus, deleteAppointment };
