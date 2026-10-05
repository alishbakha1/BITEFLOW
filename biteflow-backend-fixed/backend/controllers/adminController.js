const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Category = require('../models/Category');

// @desc    Admin dashboard summary stats
// @route   GET /api/admin/dashboard
// @access  Private (admin)
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers, totalRestaurants, totalMenuItems, totalOrders, totalCategories,
    pendingRestaurants, revenueAgg, ordersByStatus,
  ] = await Promise.all([
    User.countDocuments(),
    Restaurant.countDocuments(),
    MenuItem.countDocuments(),
    Order.countDocuments(),
    Category.countDocuments(),
    Restaurant.countDocuments({ status: 'pending' }),
    Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalRestaurants,
      totalMenuItems,
      totalOrders,
      totalCategories,
      pendingRestaurants,
      totalRevenue: revenueAgg[0]?.total || 0,
      ordersByStatus: ordersByStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
    },
  });
});

// @desc    List all users
// @route   GET /api/admin/users
// @access  Private (admin)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

// @desc    Update a user's role or active status
// @route   PUT /api/admin/users/:id
// @access  Private (admin)
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { role, isActive } = req.body;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  const updated = await user.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  await user.deleteOne();
  res.json({ success: true, message: 'User removed' });
});

// @desc    List all orders (admin view)
// @route   GET /api/admin/orders
// @access  Private (admin)
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .populate('restaurant', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
});

// @desc    List all restaurants including pending ones (admin view)
// @route   GET /api/admin/restaurants
// @access  Private (admin)
exports.getAllRestaurantsAdmin = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({}).populate('owner', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, count: restaurants.length, data: restaurants });
});

// @desc    Approve a pending restaurant
// @route   PUT /api/admin/restaurants/:id/approve
// @access  Private (admin)
exports.approveRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }
  restaurant.status = 'open';
  restaurant.verified = true;
  const updated = await restaurant.save();
  res.json({ success: true, data: updated });
});
