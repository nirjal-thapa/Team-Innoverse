const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageFileFilter = (req, file, cb) => {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, WEBP, and GIF images are allowed"));
  }
  cb(null, true);
};

const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 20 * 1024 * 1024, files: 100 }, // 20MB
});

const uploadSelfie = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME
      && process.env.CLOUDINARY_API_KEY
      && process.env.CLOUDINARY_API_SECRET
  );
}

function uploadBuffer(buffer, options = {}) {
  if (!hasCloudinaryConfig()) {
    return Promise.reject(new Error("Cloudinary credentials are not configured"));
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    stream.end(buffer);
  });
}

module.exports = { cloudinary, uploadPhoto, uploadSelfie, hasCloudinaryConfig, uploadBuffer };
