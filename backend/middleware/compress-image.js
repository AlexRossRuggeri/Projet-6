const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
  if (!req.file) return next();

  const { destination, filename } = req.file;
  const basename = path.parse(filename).name;
  const newFilename = `${basename}.webp`;
  const inputPath = path.join(destination, filename);
  const outputPath = path.join(destination, newFilename);

  sharp(inputPath)
    .resize({ width: 375 })
    .webp({ quality: 80 })
    .toFile(outputPath)
    .then(() => {
      fs.unlink(inputPath, (err) => {
        if (err) return next(err);
        req.file.filename = newFilename;
        req.file.path = outputPath;
        req.file.mimetype = 'image/webp';
        next();
      });
    })
    .catch((err) => next(err));
};
