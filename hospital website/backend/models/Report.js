const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  fileType: { type: String },
  reportType: { type: String, enum: ['lab', 'scan', 'prescription', 'other'], default: 'other' },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
