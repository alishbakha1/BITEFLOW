const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getReviews)
  .post(protect, createReview);

router.delete('/:id', protect, deleteReview);

module.exports = router;
