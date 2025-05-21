const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authentification requise' });
    }
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    req.auth = { userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentification invalide' });
  }
};
