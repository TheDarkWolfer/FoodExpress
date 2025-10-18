// routes/menuRoutes.js
/*
import express from "express";
import {
  createRestaurants,
  getRestaurants,
  getRestaurantsById,
  updateRestaurants,
  deleteRestaurants,
} from "../Restaurants.js/";
import { authMiddleware, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Lecture publique
router.get("/", getRestaurants);
router.get("/:id", getRestaurantsById);

// Actions réservées aux admins
router.post("/", authMiddleware, adminOnly, createMenu);
router.put("/:id", authMiddleware, adminOnly, updateMenu);
router.delete("/:id", authMiddleware, adminOnly, deleteMenu);

export default router;


import { validateBody } from "../middlewares/validateMiddleware.js";
import { RestaurantSchema } from "../validation/menuValidation.js";
import { getRestaurants, getRestaurantsById } from "../Restaurants.js";

router.post("/", authMiddleware, adminOnly, validateBody(RestaurantSchema), createRestaurants);
 




// controllers/restaurantsController.js
import Restaurants from "../models/Restaurants.js";

// ✅ Créer un restaurant (admin seulement)
export const createRestaurants = async (req, res) => {
  try {
    const Restaurant = await Restaurant.create(req.body);
    res.status(201).json(Restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Lire tous les restaurants (accès public, avec tri/pagination)
export const getRestaurants = async (req, res) => {
  try {
    const { sortBy, limit = 10, page = 1 } = req.query;
    const options = {};

    if (sortBy === "price") options.price = 1;
    if (sortBy === "category") options.category = 1;

    const Restaurants = await Restaurant.find()
      .sort(options)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.status(200).json(Restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Lire un seul restaurant par ID
export const getRestaurantsById = async (req, res) => {
  try {
    const Restaurant = await Restaurant.findById(req.params.id);
    if (!Restaurant) return res.status(404).json({ message: "Menu non trouvé" });
    res.status(200).json(Restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Mettre à jour un restaurant (admin seulement)
export const updateRestaurants = async (req, res) => {
  try {
    const Restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!Restaurant) return res.status(404).json({ message: "Menu non trouvé" });
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Supprimer un restaurant (admin seulement)
export const deleteRestaurants = async (req, res) => {
  try {
    const Restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!Restaurant) return res.status(404).json({ message: "Menu non trouvé" });
    res.status(200).json({ message: "Menu supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/

const express = require("express");
const jwt = require("jsonwebtoken");
const Restaurants = require("../models/Restaurants.js")
const { RestaurantsCreate, RestaurantsUpdate } = require("../validators/restaurants-validator.js");

// Middleware 
//const auth = require("./middleware/auth");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(express.json());

/*---------+
 | API ici |
 +--------*/

// Vite fait : comment voir tous les restaurants
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
  // Validation des données envoyées avant création
  if (!req.body) { 
    return res.status(418).json({error:"Missing request body !"})
  }
  
  const { error, value } = RestaurantsCreate.validate(req.body);
  if (error) {
    // En cas d'erreur, on en informe l'utilisateur.ice
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }

  // Création d'un nouveau resataurant dans la DB
  const newRestaurants = await Restaurants.create(value);
  res.status(201).json(newRestaurants);
});

// Lecture d'un restaurant 
router.get("/:id", requireAuth, async (req, res) => {
  const _Restaurant = await Restaurants.findById(req.params.id);
  if (!_Restaurant) return res.status(404).json({ message: "Restaurant not found" });
  res.json(_Restaurant);
});

// Mise à jour des données restaurants, validation des données avec JOI
router.patch("/:id", requireAuth, async (req, res) => {
  // Validation avec le schéma de mise à jour (champs optionnels)
  const { error, value } = RestaurantsUpdate.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  console.log(`Attempted PATCH to change ${req.body}`)

  // Mise à jour dans MongoDB
  const _Restaurant = await Restaurants.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!_Restaurant) return res.status(404).json({ message: "Restaurant not found" });

  res.json(Restaurants);
});

// Suppression de resaturant par ID 
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