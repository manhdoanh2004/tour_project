const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
    cloud_name: process.env.CLOUDDINARY_NAME, 
    api_key: process.env.CLOUDDINARY_APIKEY, 
    api_secret: process.env.CLOUDDINARY_APISECRET // Click 'View API Keys' above to copy your API secret
});


module.exports.storage = new CloudinaryStorage({
    cloudinary: cloudinary,
   
  });
