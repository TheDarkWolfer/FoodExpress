import mongoose from "mongoose"; // Utilisation de Mongoose au lieu de l'API MongoDB, pour des raisons de simplicité

/*-------------------+
 | Schéma de données |
 +-------------------*/


const UserScheme = new mongoose.Schema({
  id:       { type: Number, required: true}, // À auto-incrémenter
  email:    { type: String, required: true}, // Vérifier avec un REGEX
  username: { type: String, required: true}, // Aussi à vérifier avec un REGEX
  password: { type: String, required: true}, // Mettre un hash sha256 là-dedans
  admin:     { type: Boolean, required: false, default: false} // Simplifié pour être un booléen étant donné qu'on a que deux options pour ce champ
  },
  { timestamps: true }); // Utile pour débugger et en cas de demandes d'informations

export default mongoose.model("User", UserScheme);