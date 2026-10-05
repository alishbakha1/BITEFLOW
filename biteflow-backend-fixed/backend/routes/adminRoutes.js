const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllUsers, updateUser, deleteUser,
  getAllOrders, getAllRestaurantsAdmin, approveRestaurant,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.get('/restaurants', getAllRestaurantsAdmin);
router.put('/restaurants/:id/approve', approveRestaurant);

module.exports = router;
