const Order = require('../models/Order');
const Notification = require('../models/Notification');

const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, orderType, deliveryAddress, paymentMethod, notes, patientId } = req.body;
    const orderUser = req.user.role === 'pharmacist' && patientId ? patientId : req.user.id;
    const order = await Order.create({
      user: orderUser,
      items,
      totalPrice,
      orderType,
      deliveryAddress,
      paymentMethod,
      notes,
    });
    await Notification.create({
      user: orderUser,
      title: 'Order Placed',
      message: `Your order #${order._id.toString().slice(-6)} has been placed successfully`,
      type: 'order',
      link: '/patient/order-history',
    });
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Order.countDocuments({ user: req.user.id });
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, pages: Math.ceil(total / limit), orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, pages: Math.ceil(total / limit), orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('user', 'name');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    await Notification.create({
      user: order.user._id,
      title: 'Order Status Updated',
      message: `Your order #${order._id.toString().slice(-6)} status changed to ${req.body.status}`,
      type: 'order',
      link: '/patient/order-history',
    });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
