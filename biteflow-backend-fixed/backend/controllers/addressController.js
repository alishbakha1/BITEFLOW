const asyncHandler = require('express-async-handler');
const Address = require('../models/Address');

// @desc    List current user's saved addresses
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.json({ success: true, count: addresses.length, data: addresses });
});

// @desc    Add a new address
// @route   POST /api/addresses
// @access  Private
exports.addAddress = asyncHandler(async (req, res) => {
  const { label, fullAddress, city, area, phone, isDefault, latitude, longitude } = req.body;
  if (!fullAddress) {
    return res.status(400).json({ success: false, message: 'fullAddress is required' });
  }

  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
  }

  const address = await Address.create({
    user: req.user._id, label, fullAddress, city, area, phone, isDefault, latitude, longitude,
  });

  res.status(201).json({ success: true, data: address });
});

// @desc    Update a saved address
// @route   PUT /api/addresses/:id
// @access  Private
exports.updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) {
    return res.status(404).json({ success: false, message: 'Address not found' });
  }

  const { label, fullAddress, city, area, phone, isDefault, latitude, longitude } = req.body;
  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
  }

  if (label !== undefined) address.label = label;
  if (fullAddress !== undefined) address.fullAddress = fullAddress;
  if (city !== undefined) address.city = city;
  if (area !== undefined) address.area = area;
  if (phone !== undefined) address.phone = phone;
  if (isDefault !== undefined) address.isDefault = isDefault;
  if (latitude !== undefined) address.latitude = latitude;
  if (longitude !== undefined) address.longitude = longitude;

  const updated = await address.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a saved address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!address) {
    return res.status(404).json({ success: false, message: 'Address not found' });
  }
  res.json({ success: true, message: 'Address removed' });
});
