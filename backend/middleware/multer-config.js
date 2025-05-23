const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const baseName = path.parse(file.originalname).name;
    const safeName = baseName.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    const finalName = `${safeName}_${Date.now()}.${extension}`;
    callback(null, finalName);
  },
});

module.exports = multer({ storage }).single('image');
