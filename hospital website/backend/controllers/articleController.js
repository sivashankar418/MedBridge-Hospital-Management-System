const Article = require('../models/Article');

const getArticles = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('author', 'name role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, pages: Math.ceil(total / limit), articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name role');
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createArticle = async (req, res) => {
  try {
    const article = await Article.create({ ...req.body, author: req.user.id });
    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getArticles, getArticleById, createArticle, updateArticle, deleteArticle };
