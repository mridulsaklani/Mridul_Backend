const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

 const CloudUpload = async (file) => {
    try {
      if(!file) return null
      const result = await cloudinary.uploader.upload(file, {
        public_id: Date.now(),
        folder: 'user',
      });
      
      return result
    } catch (error) {
      fs.unlink(file)
      console.error(error);
      return null
    }
  };

  module.exports = CloudUpload