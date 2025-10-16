const joi = require("joi");

const RestaurantsBase = joi.object({
  id: joi.forbidden(), // Interdiction d'interférer avec les IDs données par la DB
  name: joi.string().min(3).max(30).required(),
  address: joi.string().required(),
  phone: joi.string().min(6).required(), // changé pour un string ; permet plus de flexibilité à l'internationale
  opening_hours: joi.string().required(),
});

// Dérivé du validateur de base pour la création, requiert tous les paramètres
const RestaurantsCreate = RestaurantsBase.fork(['name','address','phone','opening_hours'], s => s.required());

// Second dérivé du validateur de base, cette fois pour la MàJ : minimum un paramètre
const RestaurantsUpdate = RestaurantsBase.fork(['name','address','phone','opening_hours'], s => s.optional()).min(1);

module.exports = { RestaurantsCreate, RestaurantsUpdate };