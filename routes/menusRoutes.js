// routes/menuRoutes.js
//import express from "express";
//import {
  //createMenu,
  /*getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
//} from "../Menus.js";
//import { authMiddleware, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Lecture publique
router.get("/", getMenus);
router.get("/:id", getMenuById);

// Actions réservées aux admins
router.post("/", authMiddleware, adminOnly, createMenu);
router.put("/:id", authMiddleware, adminOnly, updateMenu);
router.delete("/:id", authMiddleware, adminOnly, deleteMenu);

export default router;


import { validateBody } from "../middlewares/validateMiddleware.js";
import { menuSchema } from "../validation/menuValidation.js";
import { getMenus, getMenuById } from "../Menus.js";


router.post("/", authMiddleware, adminOnly, validateBody(menuSchema), createMenu);




// controllers/menuController.js
import Menu from "../models/menuModel.js";

// ✅ Créer un menu (admin seulement)
export const createMenus = async (req, res) => {
  try {
    const menu = await Menu.create(req.body);
    res.status(201).json(menu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Lire tous les menus (accès public, avec tri/pagination)
export const getMenus = async (req, res) => {
  try {
    const { sortBy, limit = 10, page = 1 } = req.query;
    const options = {};

    if (sortBy === "price") options.price = 1;
    if (sortBy === "category") options.category = 1;

    const menus = await Menu.find()
      .sort(options)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Lire un seul menu par ID
export const getMenusById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu non trouvé" });
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Mettre à jour un menu (admin seulement)
export const updateMenus = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!menu) return res.status(404).json({ message: "Menu non trouvé" });
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Supprimer un menu (admin seulement)
export const deleteMenus = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu non trouvé" });
    res.status(200).json({ message: "Menu supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/


// Code Camille

const express = require("express");
const jwt = require("jsonwebtoken");
const Menus = require("../models/Menus.js")
const { userUpdate, userCreate } = require("../validators/Menus.js");

// Middleware
//const auth = require("./middleware/auth");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(express.json());

/*---------+
 | API ici |
 +--------*/

// Vite fait : comment voir tous les Menus
router.get("/",async (req,res) => {
  if (process.env.NODE_ENV === "development") {
    const Menus = await Menus.find()
    return res.status(418).json(Menus)
  } else {
    return res.status(300).json({error:"Not allowed !"})
  }
})


// Création de Menus
router.post("/",  requireAuth, async (req, res) => {
  // Validation des données envoyées avant création
  const { error, value } = MenusCreate.validate(req.body);
  if (error) {
    // En cas d'erreur, on en informe l'utilisateur.ice
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }

  // Création d'un menus
  const Menus = await Menus.create(value);
  res.status(201).json(Menus);
});

// Lecture de menus
router.get("/:id", requireAuth, async (req, res) => {
  const Menus = await Menus.findById(req.params.id);
  if (!Menus) return res.status(404).json({ message: "user not found" });
  res.json(Menus);
});

// Mise à jour de menus, validation des données avec JOI
router.patch("/:id", requireAuth, async (req, res) => {
  // Validation avec le schéma de mise à jour (champs optionnels)
  const { error, value } = MenusUpdate.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Mise à jour dans MongoDB
  const Menus = await Menus.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!Menus) return res.status(404).json({ message: "User not found" });

  res.json(Menus);
});

// Suppression de Menus
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const Menus = await Menus.findByIdAndDelete(req.params.id);
    if (!Menus) return res.status(404).json({ message: "User not found" });
    return res.json({ message: `User ${Menus.name} deleted successfully` });  
  } catch(error) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
});


module.exports = router