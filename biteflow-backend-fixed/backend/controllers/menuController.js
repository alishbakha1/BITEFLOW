const asyncHandler = require('express-async-handler');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

const canManage = (restaurant, user) =>
  user.role === 'admin' || restaurant.owner.toString() === user._id.toString();

// @desc    List menu items (optionally filtered by restaurant/category)
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = asyncHandler(async (req, res) => {
  const { restaurant, category, available } = req.query;
  const filter = {};
  if (restaurant) filter.restaurant = restaurant;
  if (category) filter.category = category;
  if (available !== undefined) filter.isAvailable = available === 'true';

  const items = await MenuItem.find(filter)
    .populate('category', 'name slug')
    .populate('restaurant', 'name image');

  res.json({ success: true, count: items.length, data: items });
});

// @desc    Get a single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItemById = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('restaurant', 'name image');
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }
  res.json({ success: true, data: item });
});

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private (restaurant_owner, admin)
exports.createMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category, image, discount, ingredients, restaurant } = req.body;

  if (!name || price === undefined || !restaurant) {
    return res.status(400).json({ success: false, message: 'name, price and restaurant are required' });
  }

  const restaurantDoc = await Restaurant.findById(restaurant);
  if (!restaurantDoc) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }
  if (!canManage(restaurantDoc, req.user)) {
    return res.status(403).json({ success: false, message: 'Not authorized to add items to this restaurant' });
  }

  const item = await MenuItem.create({
    name, description, price, category, image, discount, ingredients, restaurant,
  });

  res.status(201).json({ success: true, data: item });
});

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private (owner of the parent restaurant, or admin)
exports.updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate('restaurant');
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }
  if (!canManage(item.restaurant, req.user)) {
    return res.status(403).json({ success: false, message: 'Not authorized to modify this item' });
  }

  const updatable = ['name', 'description', 'price', 'category', 'image', 'discount', 'ingredients', 'isAvailable'];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) item[field] = req.body[field];
  });

  const updated = await item.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private (owner of the parent restaurant, or admin)
exports.deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate('restaurant');
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }
  if (!canManage(item.restaurant, req.user)) {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
  }

  await item.deleteOne();
  res.json({ success: true, message: 'Menu item removed' });
});
