const express = require("express");
const Users = require("../models/USER.js")
const { userUpdate, userCreate } = require("../validators/user.js");

const router = express.Router();
router.use(express.json());

/*---------+
 | API ici |
 +--------*/


// Création d'utilisateur.ice (ajouter l'authentification plus tard - admin uniquement)
router.post("/", async (req, res) => {
  // Validation des données envoyées avant création
  console.log(`request body : ${req.body}`)
  const { error, value } = userCreate.validate(req.body);
  if (error) {
    // En cas d'erreur, on en informe l'utilisateur.ice
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }

  // Création d'un.e nouvel.le utilisateur.ice dans la DB
  const user = await Users.create(value);
  res.status(201).json(user);
});

// Lecture d'un.e utilisateur.ices (ajouter l'authentification plus tard)
router.get("/:id", async (req, res) => {
  const user = await Users.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "user not found" });
  res.json(user);
});

// Mise à jour des données utilisateur.ices, validation des données avec JOI
router.patch("/:id", async (req, res) => {
  // Validation avec le schéma de mise à jour (champs optionnels)
  const { error, value } = userUpdate.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Mise à jour dans MongoDB
  const user = await Users.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Suppression d'utilisateur.ice par ID ; vérification du jeton d'authentification
router.delete("/:id", async (req, res) => {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `User ${user.name} deleted successfully` });
    res.status(400).json({ message: "Invalid ID format" });
});

module.exports = router