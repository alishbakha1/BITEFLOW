const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, uploadImage);

module.exports = router;
