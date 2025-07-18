const express = require('express');
const helmet = require('helmet');
const connectDB = require('./db');
const path = require('path');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  next();
});

app.use(express.json());

connectDB();

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
