const mongoose = require("mongoose"); // Utilisation de Mongoose au lieu de l'API MongoDB, pour des raisons de simplicité

const MenuScheme = new mongoose.Schema({
  name:           { type: String, required: true}, // Vous l'aurez deviné : valider avec du REGEX ^w^
  description:    { type: String, required: true}, // Possibilité de mettre une description longue
  price:          { type: Number, required: true}, // REGEX encore une fois
  category:       { type: String, requried: true}, // Ah et tout ça n'est modifiable que par les admins des restaurants
},{ timestamps: true }); // Utile pour débugger et en cas de demandes d'informations

module.exports = mongoose.model("Menus",MenuScheme);