// app.js

const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.post('/api/books', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({ message: 'Objet créé' });
  next();
});

app.get('/api/books', (req, res, next) => {
  const books = [
    {
      userId: '1a',
      title: 'Lord of the Rings',
      author: 'J.R.R. Tolkien',
      imageUrl: ' ',
      year: 1954,
      genre: 'Fantasy',
      ratings: [
        {
          userId: 'user123',
          grade: 5,
        },
        {
          userId: 'user456',
          grade: 5,
        },
      ],
      averageRating: 5,
    },
  ];
  res.status(200).json(books);
});

module.exports = app;
