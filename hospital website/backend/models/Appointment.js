const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'], default: 'pending' },
  reason: { type: String },
  notes: { type: String },
  prescription: { type: String },
  prescriptionItems: [
    {
      medicine: { type: String },
      dosage: { type: String },
      quantity: { type: Number, default: 1 },
      instruction: { type: String },
    }
  ],
  prescriptionSubmitted: { type: Boolean, default: false },
  prescriptionStatus: { type: String, enum: ['pending', 'approved', 'ready_for_delivery', 'delivered'], default: 'pending' },
  feedback: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
