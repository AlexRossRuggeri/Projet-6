const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const compressImage = require('../middleware/compress-image');
const bookCtrl = require('../controllers/book');
const ratingCtrl = require('../controllers/rating');

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.bestRating);
router.get('/:id', bookCtrl.getOneBook);

router.post('/', auth, multer, compressImage, bookCtrl.createBook);
router.put('/:id', auth, multer, compressImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

router.post('/:id/rating', auth, ratingCtrl.addRating);

module.exports = router;
