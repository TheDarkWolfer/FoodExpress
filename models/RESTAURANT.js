import mongoose from "mongoose"; // Utilisation de Mongoose au lieu de l'API MongoDB, pour des raisons de simplicité

const UserScheme = new mongoose.Schema({
  id:       { type: Number, required: true}, // À auto-incrémenter
  name:     { type: String, required: true}, // Laissé aux choix des administrateur.ices du restaurant
  address:  { type: String, required: true}, // De même, au choix des admins
  telephone:{ type: Number, required: true}, // Valider avec un REGEX
  hours:    { type: JSON, required: true},   // JSON pour simplifer l'affichage, le stockage et le traitement des horaires
  },
  { timestamps: true }); // Utile pour débugger et en cas de demandes d'informations

export default mongoose.model("User", UserScheme);