const path = require('path');
const multer = require('multer');

const isCloudinaryConfigured =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error('Only .jpg, .jpeg, .png and .webp image files are allowed'));
};

let cloudinary = null;
let upload;

if (isCloudinaryConfigured) {
  // Cloudinary is configured — upload directly to the cloud.
  cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'biteflow_uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
  });

  upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
} else {
  // No Cloudinary credentials — fall back to local disk storage under /uploads,
  // served statically at /uploads/<filename>. Good enough for local dev.
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });

  upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
}

module.exports = { cloudinary, upload, isCloudinaryConfigured };
