const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// Recompute a restaurant's average rating from its reviews
const recalcRestaurantRating = async (restaurantId) => {
  if (!restaurantId) return;
  const stats = await Review.aggregate([
    { $match: { restaurant: restaurantId } },
    { $group: { _id: '$restaurant', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Restaurant.findByIdAndUpdate(restaurantId, {
    rating: stats[0]?.avgRating || 0,
    numReviews: stats[0]?.count || 0,
  });
};

const recalcMenuItemRating = async (menuItemId) => {
  if (!menuItemId) return;
  const stats = await Review.aggregate([
    { $match: { menuItem: menuItemId } },
    { $group: { _id: '$menuItem', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await MenuItem.findByIdAndUpdate(menuItemId, {
    rating: stats[0]?.avgRating || 0,
    numReviews: stats[0]?.count || 0,
  });
};

// @desc    List reviews for a restaurant or menu item
// @route   GET /api/reviews?restaurant=&menuItem=
// @access  Public
exports.getReviews = asyncHandler(async (req, res) => {
  const { restaurant, menuItem } = req.query;
  const filter = {};
  if (restaurant) filter.restaurant = restaurant;
  if (menuItem) filter.menuItem = menuItem;

  const reviews = await Review.find(filter).populate('user', 'name avatar').sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res) => {
  const { restaurant, menuItem, order, rating, comment } = req.body;

  if (!rating || (!restaurant && !menuItem)) {
    return res.status(400).json({ success: false, message: 'rating and either restaurant or menuItem are required' });
  }

  const review = await Review.create({
    user: req.user._id, restaurant, menuItem, order, rating, comment,
  });

  await recalcRestaurantRating(restaurant);
  await recalcMenuItemRating(menuItem);

  res.status(201).json({ success: true, data: review });
});

// @desc    Delete a review (own review, or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
  }

  const { restaurant, menuItem } = review;
  await review.deleteOne();
  await recalcRestaurantRating(restaurant);
  await recalcMenuItemRating(menuItem);

  res.json({ success: true, message: 'Review removed' });
});
