const express = require('express');
const router = express.Router();
const {
  getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem,
} = require('../controllers/menuController');
const { protect, adminOrOwner } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { menuItemValidator } = require('../validators/restaurantValidators');

router.route('/')
  .get(getMenuItems)
  .post(protect, adminOrOwner, menuItemValidator, validate, createMenuItem);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, adminOrOwner, updateMenuItem)
  .delete(protect, adminOrOwner, deleteMenuItem);

module.exports = router;
