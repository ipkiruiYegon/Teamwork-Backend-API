const { config, uploader } = require('cloudinary');
const configs = require('config');

const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: configs.get('cloud_name'),
    api_key: configs.get('api_key'),
    api_secret: configs.get('api_secret')
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
