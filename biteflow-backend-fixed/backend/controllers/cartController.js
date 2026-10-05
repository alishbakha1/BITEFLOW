const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const populateCart = (cart) =>
  cart.populate('items.menuItem', 'name image price isAvailable').then(() => cart.populate('restaurant', 'name image'));

// @desc    Get the current user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await populateCart(cart);
  res.json({ success: true, data: cart });
});

// @desc    Add an item to the cart (or bump its quantity)
// @route   POST /api/cart
// @access  Private
exports.addToCart = asyncHandler(async (req, res) => {
  const { menuItemId, quantity = 1 } = req.body;
  if (!menuItemId) {
    return res.status(400).json({ success: false, message: 'menuItemId is required' });
  }

  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }
  if (!menuItem.isAvailable) {
    return res.status(400).json({ success: false, message: 'This item is currently unavailable' });
  }

  const cart = await getOrCreateCart(req.user._id);

  // BiteFlow supports one active restaurant per cart — switching restaurants clears it
  if (cart.restaurant && cart.restaurant.toString() !== menuItem.restaurant.toString()) {
    cart.items = [];
  }
  cart.restaurant = menuItem.restaurant;

  const existing = cart.items.find((i) => i.menuItem.toString() === menuItemId);
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.items.push({ menuItem: menuItemId, quantity: Number(quantity), price: menuItem.price });
  }

  await cart.save();
  await populateCart(cart);
  res.status(201).json({ success: true, data: cart });
});

// @desc    Update an item's quantity in the cart
// @route   PUT /api/cart/:menuItemId
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ success: false, message: 'quantity must be at least 1' });
  }

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((i) => i.menuItem.toString() === req.params.menuItemId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found in cart' });
  }

  item.quantity = Number(quantity);
  await cart.save();
  await populateCart(cart);
  res.json({ success: true, data: cart });
});

// @desc    Remove an item from the cart
// @route   DELETE /api/cart/:menuItemId
// @access  Private
exports.removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((i) => i.menuItem.toString() !== req.params.menuItemId);
  if (cart.items.length === 0) cart.restaurant = undefined;

  await cart.save();
  await populateCart(cart);
  res.json({ success: true, data: cart });
});

// @desc    Clear the entire cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  cart.restaurant = undefined;
  await cart.save();
  res.json({ success: true, data: cart });
});
