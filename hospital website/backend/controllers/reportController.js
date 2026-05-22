const Report = require('../models/Report');
const path = require('path');

// @desc  Upload report (admin)
const uploadReport = async (req, res) => {
  try {
    const { patient, title, description, reportType } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const fileType = req.file ? path.extname(req.file.originalname).slice(1) : null;

    const report = await Report.create({
      patient,
      uploadedBy: req.user.id,
      title,
      description,
      fileUrl,
      fileType,
      reportType,
    });
    await report.populate('patient', 'name email');
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get my reports (patient)
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.user.id })
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get all reports (admin/doctor)
const getAllReports = async (req, res) => {
  try {
    const { patientId } = req.query;
    const query = {};
    if (patientId) query.patient = patientId;
    const reports = await Report.find(query)
      .populate('patient', 'name email')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete report
const deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadReport, getMyReports, getAllReports, deleteReport };
