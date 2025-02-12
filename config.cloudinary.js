const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "wonderLust_IMG", // Cloudinary folder name
      allowed_formats: ["jpg", "png", "jpeg"], // Allowed file formats
    },
  });
  const upload = multer({ storage });
module.exports = { upload, cloudinary };