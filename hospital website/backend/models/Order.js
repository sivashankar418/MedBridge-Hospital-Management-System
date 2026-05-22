const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, refPath: 'items.itemType' },
  itemType: { type: String, enum: ['Medicine', 'LabTest'] },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  orderType: { type: String, enum: ['medicine', 'labtest', 'mixed'], default: 'medicine' },
  deliveryAddress: { type: String },
  paymentMethod: { type: String, default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
