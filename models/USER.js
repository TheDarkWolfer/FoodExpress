const mongoose = require("mongoose"); // Utilisation de Mongoose au lieu de l'API MongoDB, pour des raisons de simplicité
const bcrypt = require("bcrypt"); // BCrypt pour le chiffrement des

/*-------------------+
 | Schéma de données |
 +-------------------*/

const UserSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true }, // Vérificationa avec JOI
  username: { type: String, required: true, unique: true, trim: true }, // Vérification avec JOI également
  password: { type: String, required: true }, // Mot de passe hashé (histoire d'adhérer au RGPD)
  role:     { type: String, enum: ["user", "admin"], default: "user", required: true }, // Retour au rôle en string, en cas de besoin futur
}, { timestamps: true });

// Virtual "id" from _id
UserSchema.virtual("id").get(function () {
  return this._id.toString();
});
UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.password; // au cas où, pour éviter d'éfficher le mdp
  }
});

// Hashage du mdp avant sa sauvegarde dans la DB
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Vérification du mot de passe (pour les connections)
UserSchema.methods.checkPassword = async function (plain) {
  const attempt = await bcrypt.hash(plain,12)
  const result = await bcrypt.compare(plain, this.password)
  return result;
};

// Export du module
module.exports = mongoose.model("User", UserSchema);
