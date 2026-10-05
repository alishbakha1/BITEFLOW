const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// @desc    List restaurants (supports search, category filter, pagination)
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = asyncHandler(async (req, res) => {
  const { search, category, featured, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (search) filter.$text = { $search: search };
  if (category) filter.categories = category;
  if (featured !== undefined) filter.featured = featured === 'true';

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const [restaurants, total] = await Promise.all([
    Restaurant.find(filter)
      .populate('categories', 'name slug')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 }),
    Restaurant.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: restaurants.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    data: restaurants,
  });
});

// @desc    Get single restaurant with its menu
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).populate('categories', 'name slug');
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  const menuItems = await MenuItem.find({ restaurant: req.params.id }).populate('category', 'name slug');
  res.json({ success: true, restaurant, menuItems });
});

// @desc    Create a restaurant
// @route   POST /api/restaurants
// @access  Private (restaurant_owner, admin)
exports.createRestaurant = asyncHandler(async (req, res) => {
  const {
    name, description, cuisine, address, image, logo, categories,
    deliveryTime, deliveryFee, minimumOrder, priceLevel,
  } = req.body;

  if (!name || !address) {
    return res.status(400).json({ success: false, message: 'Name and address are required' });
  }

  const restaurant = await Restaurant.create({
    name,
    description,
    cuisine,
    address,
    image,
    logo,
    categories,
    deliveryTime,
    deliveryFee,
    minimumOrder,
    priceLevel,
    owner: req.user._id,
    // Admin-created restaurants go live immediately; owners' submissions need approval
    status: req.user.role === 'admin' ? 'open' : 'pending',
  });

  res.status(201).json({ success: true, data: restaurant });
});

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (owner of the restaurant, or admin)
exports.updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  const isOwner = restaurant.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to modify this restaurant' });
  }

  const updatable = [
    'name', 'description', 'cuisine', 'address', 'image', 'logo', 'categories',
    'deliveryTime', 'deliveryFee', 'minimumOrder', 'priceLevel', 'isOpen', 'featured',
  ];
  // Only admins can flip status/verified directly
  if (req.user.role === 'admin') updatable.push('status', 'verified');

  updatable.forEach((field) => {
    if (req.body[field] !== undefined) restaurant[field] = req.body[field];
  });

  const updated = await restaurant.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (owner of the restaurant, or admin)
exports.deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  const isOwner = restaurant.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this restaurant' });
  }

  await MenuItem.deleteMany({ restaurant: restaurant._id });
  await restaurant.deleteOne();

  res.json({ success: true, message: 'Restaurant removed' });
});

// @desc    Add a menu item to a restaurant (kept at this nested route for
//          backward compatibility — full CRUD also lives in menuController)
// @route   POST /api/restaurants/:restaurantId/menu
// @access  Private (owner of the restaurant, or admin)
exports.addMenuItem = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  const isOwner = restaurant.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to modify this restaurant' });
  }

  const { name, description, price, category, image, discount, ingredients } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ success: false, message: 'Name and price are required' });
  }

  const menuItem = await MenuItem.create({
    name,
    description,
    price,
    category,
    image,
    discount,
    ingredients,
    restaurant: req.params.restaurantId,
  });

  res.status(201).json({ success: true, data: menuItem });
});
