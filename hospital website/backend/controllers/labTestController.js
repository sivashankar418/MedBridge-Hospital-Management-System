const LabTest = require('../models/LabTest');

const getLabTests = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;

    const total = await LabTest.countDocuments(query);
    const labTests = await LabTest.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ name: 1 });

    res.json({ success: true, total, pages: Math.ceil(total / limit), labTests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLabTestById = async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.id);
    if (!labTest) return res.status(404).json({ success: false, message: 'Lab test not found' });
    res.json({ success: true, labTest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createLabTest = async (req, res) => {
  try {
    const labTest = await LabTest.create(req.body);
    res.status(201).json({ success: true, labTest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLabTest = async (req, res) => {
  try {
    const labTest = await LabTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!labTest) return res.status(404).json({ success: false, message: 'Lab test not found' });
    res.json({ success: true, labTest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLabTest = async (req, res) => {
  try {
    await LabTest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Lab test deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLabTests, getLabTestById, createLabTest, updateLabTest, deleteLabTest };
