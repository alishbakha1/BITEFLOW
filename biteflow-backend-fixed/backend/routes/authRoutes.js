const express = require('express');
const router = express.Router();
const {
  registerUser, loginUser, logoutUser, getCurrentUser, updateProfile, changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { registerValidator, loginValidator, changePasswordValidator } = require('../validators/authValidators');
const { authLimiter } = require('../middleware/rateLimiters');

router.post('/register', authLimiter, registerValidator, validate, registerUser);
router.post('/login', authLimiter, loginValidator, validate, loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getCurrentUser);
router.get('/profile', protect, getCurrentUser); // kept for backward compatibility
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePasswordValidator, validate, changePassword);

module.exports = router;
