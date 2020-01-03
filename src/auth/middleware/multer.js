const multer = require('multer');

const storage = multer.memoryStorage();
// const multerUploads = ;
module.exports = multer({ storage }).single('gif');
