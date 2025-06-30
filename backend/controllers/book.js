const Book = require('../models/Book.js');
const fs = require('fs');
const path = require('path');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'Livre enregistré!' });
    })
    .catch((error) => {
      console.error('Erreur lors de la création du livre:', error);
      res.status(400).json({ message: 'Echec de l\'enregistrement du livre'
       });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: 'Non-autorisé' });
      }

      if (req.file && book.imageUrl) {
        const oldFilename = book.imageUrl.split('/images/')[1];
        const oldFilePath = path.join(__dirname, '..', 'images', oldFilename);
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.warn('Impossible de supprimer l’ancienne image :', err);
          }
        });
      }
      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id },
      )
        .then(() => res.status(200).json({ message: 'Livre modifié' }))
        .catch((error) => {
          console.error('Erreur lors de la modification du livre:', error);
          res.status(401).json({ message: 'Echec de la modification du livre' });
        });
    })
    .catch((error) => {
      console.error('Erreur lors de la recherche du livre:', error);
     res.status(400).json({ message: 'Livre non trouvé' });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Livre supprimé!' });
            })
            .catch((error) => {
              console.error('Erreur lors de la suppression du livre:', error);
              res.status(500).json({ message: 'Echec de la suppression du livre' });
            });
        });
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la recherche du livre:', error);
      res.status(400).json({ message: 'Livre non trouvé ou requête invalide' });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération du livre:', error);
      res.status(404).json({ message: 'Livre non trouvé' });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des livres:', error);
      res.status(400).json({ message: 'Echec de la récupération des livres' });
    });
};

exports.bestRating = async (req, res, next) => {
  try {
    const topBooks = await Book.find({ 'ratings.0': { $exists: true } })
      .sort({ averageRating: -1 })
      .limit(3)
      .select('title author imageUrl year genre averageRating');

    res.status(200).json(topBooks);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Oops, impossible de récupérer les meilleurs livres.' });
  }
};
