const express = require('express');
const router = express.Router();
const {
  createOrder, getUserOrders, getOrderById, updateOrderStatus, cancelOrder,
} = require('../controllers/orderController');
const { protect, adminOrOwner } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createOrderValidator } = require('../validators/orderValidators');

router.route('/')
  .post(protect, createOrderValidator, validate, createOrder)
  .get(protect, getUserOrders);

router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOrOwner, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
