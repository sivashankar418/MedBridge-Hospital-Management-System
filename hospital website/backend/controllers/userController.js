const User = require('../models/User');

// @desc  Get all users (admin)
const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ success: true, count: users.length, total, pages: Math.ceil(total / limit), users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all doctors
const getDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    const query = { role: 'doctor', isActive: true };
    if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { specialization: { $regex: search, $options: 'i' } }];

    const doctors = await User.find(query).select('-password').sort({ name: 1 });
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single user
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Create user (admin)
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update user (admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete user (admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get analytics (admin)
const getAnalytics = async (req, res) => {
  try {
    const [totalPatients, totalDoctors, totalAdmins] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      User.countDocuments({ role: 'admin' }),
    ]);
    res.json({ success: true, analytics: { totalPatients, totalDoctors, totalAdmins, totalUsers: totalPatients + totalDoctors + totalAdmins } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, getDoctors, getUserById, createUser, updateUser, deleteUser, getAnalytics };
