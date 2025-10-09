import mongoose from "mongoose"; // Utilisation de Mongoose au lieu de l'API MongoDB, pour des raisons de simplicité

const UserScheme = new mongoose.Schema({
  id:             { type: Number, required: true}, // À auto-incrémenter
  restaurant_id:  { type: Number, required: true}, // Valider en vérifiant l'existence du restaurant dans la DB ; empêcher les admins d'un restaurant de rattacher un menu à un autre restaurant => check d'IDs
  name:           { type: String, required: true}, // Vous l'aurez deviné : valider avec du REGEX ^w^
  description:    { type: String, required: true}, // Possibilité de mettre une description longue
  price:          { type: Number, required: true}, // REGEX encore une fois
  category:       { type: String, requried: true}, // Ah et tout ça n'est modifiable que par les admins des restaurants
},{ timestamps: true }); // Utile pour débugger et en cas de demandes d'informations

export default mongoose.model("User", UserScheme);