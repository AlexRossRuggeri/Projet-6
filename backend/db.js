const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb+srv://AlexR:jadsIc-qimjed-4ruhzu@restful-api-db.bqsosmv.mongodb.net/?retryWrites=true&w=majority&appName=restful-api-db';
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connexion à MongoDB réussie !');
  } catch (err) {
    console.error('Connexion à MongoDB échouée !', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
