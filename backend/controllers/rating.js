const Book = require('../models/Book.js');

function calculateAverage(ratings) {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, { grade }) => acc + grade, 0);
  return sum / ratings.length;
}

function attachRating(book, userId, grade) {
  if (book.ratings.some((r) => r.userId === userId)) {
    throw new Error('Déjà noté');
  }
  book.ratings.push({ userId, grade });
}

exports.addRating = async (req, res, next) => {
  const { id: bookId } = req.params;
  const userId = req.auth.userId;
  const grade = Number(req.body.rating);

  if (!userId || !grade || grade < 1 || grade > 5) {
    return res.status(400).json({ error: 'Données invalides' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    try {
      attachRating(book, userId, grade);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la note:', err);
      return res.status(403).json({ error: 'Déjà noté' });
    }

    book.averageRating = calculateAverage(book.ratings);
    await book.save();

    return res.status(201).json(book);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la note:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
