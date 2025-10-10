const joi = require("joi");
/*------------+
 | Validation |
 +------------*/

// Validateur de base pour les utilisateur.ices
exports.userBase = joi.object({
  id:joi.forbidden(), // Les IDs sont gérées automatiquement, on ne laisse pas les utilisateurs ou les admins les changer
  email: joi.string().email().required(),
  username: joi.string().alphanum().min(3).max(30).required(),
  password: joi.string().min(6).required(),
  admin: joi.string().valid(['user','admin']).default('user')
});

// Dérivé du validateur de base pour la création, requiert tous les paramètres
const userCreate = userBase.fork(['email','username','password','admin'], s => s.required());

// Second dérivé du validateur de base, cette fois pour la MàJ : minimum un paramètre
const userUpdate = userBase.fork(['email','username','password','admin'], s => s.optional()).min(1);