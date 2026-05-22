const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  image: { type: String },
  isPublished: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
