const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Place an order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res) => {
  const { restaurant, items, deliveryAddress, contactPhone, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items specified' });
  }
  if (!deliveryAddress) {
    return res.status(400).json({ success: false, message: 'deliveryAddress is required' });
  }

  const restaurantDoc = await Restaurant.findById(restaurant);
  if (!restaurantDoc) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  // Price items server-side rather than trusting client-supplied prices
  const menuItemIds = items.map((i) => i.menuItem);
  const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });
  const menuItemMap = new Map(menuItems.map((m) => [m._id.toString(), m]));

  const orderItems = items.map((i) => {
    const menuItem = menuItemMap.get(i.menuItem);
    if (!menuItem) {
      throw Object.assign(new Error(`Menu item ${i.menuItem} not found`), { statusCode: 404 });
    }
    return {
      menuItem: menuItem._id,
      name: menuItem.name,
      quantity: i.quantity,
      price: menuItem.price,
    };
  });

  const itemsPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = restaurantDoc.deliveryFee || 0;
  const totalAmount = itemsPrice + deliveryFee;

  const order = await Order.create({
    user: req.user._id,
    restaurant,
    items: orderItems,
    itemsPrice,
    deliveryFee,
    totalAmount,
    deliveryAddress,
    contactPhone,
    paymentMethod,
  });

  res.status(201).json({ success: true, data: order });
});

// @desc    Get current user's orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('restaurant', 'name image')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Get a single order (owner, restaurant owner, or admin)
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurant', 'name image owner')
    .populate('user', 'name email');
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const isCustomer = order.user._id.toString() === req.user._id.toString();
  const isRestaurantOwner = order.restaurant.owner?.toString() === req.user._id.toString();
  if (!isCustomer && !isRestaurantOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
  }

  res.json({ success: true, data: order });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (restaurant_owner, admin)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out For Delivery', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `status must be one of: ${validStatuses.join(', ')}` });
  }

  const order = await Order.findById(req.params.id).populate('restaurant', 'owner');
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const isRestaurantOwner = order.restaurant.owner?.toString() === req.user._id.toString();
  if (!isRestaurantOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
  }

  order.status = status;
  if (status === 'Cancelled' && req.body.cancelReason) order.cancelReason = req.body.cancelReason;
  const updatedOrder = await order.save();
  res.json({ success: true, data: updatedOrder });
});

// @desc    Cancel own order (only while still Pending)
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
  }
  if (order.status !== 'Pending') {
    return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled' });
  }

  order.status = 'Cancelled';
  order.cancelReason = req.body.reason || 'Cancelled by customer';
  const updated = await order.save();
  res.json({ success: true, data: updated });
});
