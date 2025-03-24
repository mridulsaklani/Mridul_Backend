const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

 const upload = async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: 'uploads',
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
//   const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
  