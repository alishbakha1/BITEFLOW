const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// @desc    List all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, count: categories.length, data: categories });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.json({ success: true, data: category });
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (admin)
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  const exists = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Category already exists' });
  }

  const category = await Category.create({ name, image });
  res.status(201).json({ success: true, data: category });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private (admin)
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  const { name, image, isActive } = req.body;
  if (name !== undefined) category.name = name;
  if (image !== undefined) category.image = image;
  if (isActive !== undefined) category.isActive = isActive;

  const updated = await category.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (admin)
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  await category.deleteOne();
  res.json({ success: true, message: 'Category removed' });
});
