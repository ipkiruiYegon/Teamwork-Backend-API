require('dotenv').config();
const { config, uploader } = require('cloudinary');

const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  });
  next();
};

// exports.uploads = file =>
//   new Promise(resolve => {
//     cloudinary.uploader.upload(
//       file,
//       result => {
//         resolve({ url: result.url, id: result.public_id });
//       },
//       { resource_type: 'auto' }
//     );
//   });
module.exports = { cloudinaryConfig, uploader };
