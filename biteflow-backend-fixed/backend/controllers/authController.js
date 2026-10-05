const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  address: user.address,
  phone: user.phone,
  avatar: user.avatar,
  createdAt: user.createdAt,
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, address, phone } = req.body;

  const userExists = await User.findOne({ email: email?.toLowerCase() });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  // Only allow self-registering as customer or restaurant_owner — never admin
  const safeRole = role === 'restaurant_owner' ? 'restaurant_owner' : 'customer';

  const user = await User.create({ name, email, password, role: safeRole, address, phone });

  res.status(201).json({
    success: true,
    user: sanitizeUser(user),
    token: generateToken(user._id),
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'This account has been deactivated' });
  }

  res.json({
    success: true,
    user: sanitizeUser(user),
    token: generateToken(user._id),
  });
});

// @desc    Log out current user (stateless JWT — client discards the token)
// @route   POST /api/auth/logout
// @access  Private
exports.logoutUser = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = asyncHandler(async (req, res) => {
  // req.user is already populated (minus password) by the protect middleware
  res.json(sanitizeUser(req.user));
});

// @desc    Update current user's profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { name, address, phone, avatar } = req.body;
  if (name !== undefined) user.name = name;
  if (address !== undefined) user.address = address;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;

  const updatedUser = await user.save();
  res.json(sanitizeUser(updatedUser));
});

// @desc    Change current user's password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user || !(await user.matchPassword(currentPassword))) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});
