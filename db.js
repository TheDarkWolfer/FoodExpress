const mongoose = require("mongoose"); // Mongoose pour l'interface MongoDB
const dotenv = require("dotenv"); // .env (dotenv) pour la config générale

dotenv.config();

let connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        dbName:process.env.DB_NAME || 'FoodExpress'
      }
    );
    console.log(`Connecté à MongoDB !`)
  } catch(error) {
    console.error(`/!\\ ERREUR - MONGODB /!\\\n${error}`)
  }
}

module.exports = connectDB;