const Book = require('../models/Book.js');

exports.addRating = async (req, res, next) => {
  const bookId = req.params.id;
  const userId = req.auth.userId;
  const rating = Number(req.body.rating);

  if (!userId || !rating || rating < 1 || rating > 5) {
    res.status(400).json({ error: 'Données invalides' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({ error: 'Livre non trouvé' });
    }
    const hasRated = book.ratings.some((r) => r.userId === userId);
    if (hasRated) return res.status(403).json({ error: 'Déjà noté' });

    book.ratings.push({ userId, grade: rating });

    const total = book.ratings.reduce((acc, r) => acc + r.grade, 0);
    book.averageRating = total / book.ratings.length;

    await book.save();

    return res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
