const multer = require('multer');
const Datauri = require('datauri');
const path = require('path');

const { ErrorHandler } = require('../../auth/middleware/error');

const storage = multer.memoryStorage();

const multerUploads = multer({
  storage,
  // eslint-disable-next-line consistent-return
  fileFilter(req, file, callback) {
    const ext = path.extname(file.originalname);
    if (ext !== '.gif') {
      return callback(new ErrorHandler(400, 'Only GIF images are allowed'));
      // return callback(new Error('nly GIF images are allowed'));
    }
    callback(null, true);
  }
}).single('gif');
const dUri = new Datauri();

// eslint-disable-next-line max-len
const dataUri = req =>
  dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
module.exports = { multerUploads, dataUri };
