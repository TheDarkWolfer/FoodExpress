const express = require("express");
const jwt = require("jsonwebtoken");
const Restaurants = require("../models/Restaurants.js")
const { RestaurantsCreate, RestaurantsUpdate } = require("../validators/restaurants-validator.js");

// Middleware 
//const auth = require("./middleware/auth");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(express.json());

// voir tous les restaurants
router.get("/",async (req,res) => {
  if (process.env.NODE_ENV === "development") {
    const _Restaurant = await Restaurants.find()
    return res.status(418).json(_Restaurant)
  } else {
    return res.status(300).json({error:"Not allowed !"})
  }
})


// Création de restaurant 
router.post("/",  requireAuth, async (req, res) => {
  // Validation des données 
  if (!req.body) { 
    return res.status(418).json({error:"Missing request body !"})
  }
  
  const { error, value } = RestaurantsCreate.validate(req.body);
  if (error) {
    // Pour l'erreur 
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }

  const newRestaurants = await Restaurants.create(value);
  res.status(201).json(newRestaurants);
});

// Lecture restaurant 
router.get("/:id", requireAuth, async (req, res) => {
  const _Restaurant = await Restaurants.findById(req.params.id);
  if (!_Restaurant) return res.status(404).json({ message: "Restaurant not found" });
  res.json(_Restaurant);
});

// MAJ des données restaurants, validation des données avec JOI
router.patch("/:id", requireAuth, async (req, res) => {
  // Validation avec le schéma de mise à jour (champs optionnels)
  const { error, value } = RestaurantsUpdate.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Mise à jour dans MongoDB
  const _Restaurant = await Restaurants.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!_Restaurant) return res.status(404).json({ message: "Restaurant not found" });

  res.json(Restaurants);
});

// Suppression resaturant par ID 
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const _Restaurant = await Restaurants.findByIdAndDelete(req.params.id);
    if (!_Restaurant) return res.status(404).json({ message: "User not found" });
    return res.json({ message: `User ${_Restaurant.name} deleted successfully` });  
  } catch(error) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
});

module.exports = router