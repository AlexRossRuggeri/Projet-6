const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => {
          console.error('Erreur lors de la création de l\'utilisateur',error);
          res.status(400).json({ message: 'Impossible de créer l\'utilisateur.' });});
    })
    .catch((error) => {
      console.error('Erreur lors du hachage du mot de passe:', error);
      res.status(500).json({ message: 'Erreur serveur.' });});
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Paire identifiant/mot de passe incorrecte !' });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({
                message: 'Paire identifiant/mot de passe incorrecte !',
              });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '24h',
              }),
            });
          })
          .catch((error) => {
            res.status(500).json({ message: 'Erreur Serveur.' });});
      }
    })
    .catch((error) => {
      res.status(500).json({ message: 'Erreur Serveur.' });
    });
};
