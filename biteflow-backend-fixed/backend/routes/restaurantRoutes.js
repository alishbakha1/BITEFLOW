const express = require('express');
const router = express.Router();
const {
  getRestaurants, getRestaurantById, createRestaurant,
  updateRestaurant, deleteRestaurant, addMenuItem,
} = require('../controllers/restaurantController');
const { protect, adminOrOwner } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { restaurantValidator, menuItemValidator } = require('../validators/restaurantValidators');

router.route('/')
  .get(getRestaurants)
  .post(protect, adminOrOwner, restaurantValidator, validate, createRestaurant);

router.route('/:id')
  .get(getRestaurantById)
  .put(protect, adminOrOwner, updateRestaurant)
  .delete(protect, adminOrOwner, deleteRestaurant);

// Kept for backward compatibility with the original nested-menu endpoint
router.post('/:restaurantId/menu', protect, adminOrOwner, menuItemValidator, validate, addMenuItem);

module.exports = router;
