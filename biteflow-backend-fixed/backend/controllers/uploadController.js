const { isCloudinaryConfigured } = require('../config/cloudinary');

// @desc    Upload a single image
// @route   POST /api/upload
// @access  Private
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  if (isCloudinaryConfigured) {
    // multer-storage-cloudinary already uploaded the file; req.file.path is the CDN URL
    return res.status(200).json({
      success: true,
      imageUrl: req.file.path,
      public_id: req.file.filename,
    });
  }

  // Local disk fallback — served statically from /uploads
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    imageUrl,
    filename: req.file.filename,
  });
};
