const express = require("express");
const jwt = require("jsonwebtoken");
const Menus = require("../models/MENUS.js")
const { MenusUpdate, MenusCreate } = require("../validators/menus-validator.js");

// Middleware
//const auth = require("./middleware/auth");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(express.json());

// voir les Menus
router.get("/",async (req,res) => {
  if (process.env.NODE_ENV === "development") {
    const menus = await Menus.find()
    return res.status(418).json(menus)
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
 
  const menu = await Menus.create(value);
  res.status(201).json(menu);
});

// Lecture  menus
router.get("/:id", requireAuth, async (req, res) => {
  const _Menus = await Menus.findById(req.params.id);
  if (!_Menus) return res.status(404).json({ message: "user not found" });
  res.json(_Menus);
});

// MAJ de menus, validation des données avec JOI
router.patch("/:id", requireAuth, async (req, res) => {
  // Validation avec le schéma de mise à jour (champs optionnels)
  const { error, value } = MenusUpdate.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  
  const _Menus = await Menus.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!_Menus) return res.status(404).json({ message: "Menu not found" });

  res.json(_Menus);
});

// Suppression  Menus
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const _Menus = await Menus.findByIdAndDelete(req.params.id);
    if (!_Menus) return res.status(404).json({ message: "Menu not found" });
    return res.json({ message: `Menu '${_Menus.name}' deleted successfully` });  
  } catch(error) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
});


module.exports = router