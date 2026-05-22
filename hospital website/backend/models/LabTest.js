const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: String },
  parameters: [{ type: String }],
  category: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('LabTest', labTestSchema);
