const express = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../models/USER.js")
const bcrypt = require("bcrypt")
const { userUpdate, userCreate } = require("../validators/users-validator.js");

// Middleware pour l'authentification
//const auth = require("./middleware/auth");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(express.json());

/*---------+
 | API ici |
 +--------*/

// Vite fait : comment voir tous les utilisateur.ices (uniquement fonctionnel dans l'environnement de dév)
router.get("/",async (req,res,next) => {
  if (process.env.NODE_ENV === "development") {
    const users = await Users.find()
    return res.status(418).json(users)
  } else {
    return res.status(300).json({error:"Not allowed !"})
  }
})


// Création d'utilisateur.ice (ajouter l'authentification plus tard - admin uniquement)
router.post("/",  async (req, res) => {
  // Validation des données envoyées avant création
  const { error, value } = userCreate.validate(req.body);
  if (error) {
    // En cas d'erreur, on en informe l'utilisateur.ice
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }

  // Création d'un.e nouvel.le utilisateur.ice dans la DB
  try {
    const user = await Users.create(value);
    return res.status(201).json(user);
  } catch(error) {

    // On différencie les erreurs de création de compte classiques, et la tentative de création d'un.e utilisateur.ice déjà présent.e dans la BDD
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res.status(409).json({message:'Error : attempted registration of duplicate users !'})
    }
    console.error(`${error}`)
    return res.status(400).json({message:'Error during registration, please either retry or contact the administrators'})
  }
});

// Lecture d'un.e utilisateur.ices (ajouter l'authentification plus tard)
router.get("/:id", requireAuth, async (req, res) => {
  const user = await Users.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "user not found" });
  return res.status(200).json(user);
});

// Mise à jour des données utilisateur.ices, validation des données avec JOI
router.patch("/:id", requireAuth, async (req, res) => {
  // Fix pour l'Issue #1 : hashage non appliqué en cas de PATCH
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password,12)
  }

  // Validation avec le schéma de mise à jour (champs optionnels)
  const { error, value } = userUpdate.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Mise à jour dans MongoDB
  const user = await Users.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json(user);
});

// Suppression d'utilisateur.ice par ID ; vérification du jeton d'authentification
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: `User ${user.name} deleted successfully` });  
  } catch(error) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
});

router.post("/login", async (req,res,next) => {
  try {
    const {username, password} = req.body; // Bon, il faut mentionner l'utilité d'un certificat SSL lors du déploiement ^.^
    if (!username || !password) { 
      // On s'assure qu'il y a bien les données
      return res.status(400).json({error:"Username and password required for this action !"})
    }

    const user = await Users.findOne({
      $or : [{email:username.toLowerCase()},{username:username}]
    });
    
    // Fun fact : si on fait cette vérification de manière asynchrone, le programme
    // renvoie un token *valide* même si le mot de passe est incorrect ! Qui l'eut crû !
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await user.checkPassword(password);   // ← AWAIT it
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      {sub:user.id,role:user.role}, // ID de l'utilisateur.ice et son rôle, signés avec le secret du JWT
      process.env.SECRET, // On utilise le secret défini dans .env
      {expiresIn:process.env.JWT_EXPIRES||"2h"} // Expiration en 2h par défaut, sinon comme configuré dans le .env
    )
    return res.status(200).json({
      token,
      user: { id: user.id, email: user.email, username: user.username, role: user.role }
    });

  } catch(error) {
    console.error(error)
    return res.status(500).json({error:"Something went wrong with the server, please send emotional support Monster Munches"})
  }
})

module.exports = router