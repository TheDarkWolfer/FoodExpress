// validation/menuValidation.js
const joi = require("joi")

const menuSchema = joi.object({
  name: joi.string().min(3).required(),
  description: joi.string().allow(""),
  price: joi.number().positive().required(),
  category: joi.string().required(),
});


// Dérivé du validateur de base pour la création, requiert tous les paramètres
const MenusCreate = menuSchema.fork(['name','description','price','category'], s => s.required());

// Second dérivé du validateur de base, cette fois pour la MàJ : minimum un paramètre
const MenusUpdate = menuSchema.fork(['name','description','price','category'], s => s.optional()).min(1);


module.exports = { MenusCreate, MenusUpdate }