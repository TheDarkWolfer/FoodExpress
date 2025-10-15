const express = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../models/USER.js")
const { userUpdate, userCreate } = require("../validators/user.js");

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
router.post("/",  requireAuth, async (req, res) => {
  // Validation des données envoyées avant création
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
router.get("/:id", requireAuth, async (req, res) => {
  const user = await Users.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "user not found" });
  res.json(user);
});

// Mise à jour des données utilisateur.ices, validation des données avec JOI
router.patch("/:id", requireAuth, async (req, res) => {
  // Validation avec le schéma de mise à jour (champs optionnels)
  const { error, value } = userUpdate.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Mise à jour dans MongoDB
  const user = await Users.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

// Suppression d'utilisateur.ice par ID ; vérification du jeton d'authentification
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: `User ${user.name} deleted successfully` });  
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
      console.log(`U:${username} P:${password}`)
    }

    const user = await Users.findOne({
      $or : [{email:username.toLowerCase()},{username:username}]
    });
    
    // Fun fact : si on fait cette vérification de manière asynchrone, le programme
    // renvoie un token *valide* même si le mot de passe est incorrect ! Qui l'eut crû !
    if (!user || user.checkPassword(password)) { 
      return res.status(401).json({error:"Invalid credentials"})
    }

    const token = jwt.sign(
      {sub:user.id,role:user.role}, // ID de l'utilisateur.ice et son rôle, signés avec le secret du JWT
      process.env.SECRET, // On utilise le secret défini dans .env
      {expiresIn:process.env.JWT_EXPIRES||"2h"} // Expiration en 2h par défaut, sinon comme configuré dans le .env
    )
    return res.status(202).json({
      token,
      user: { id: user.id, email: user.email, username: user.username, role: user.role }
    });

  } catch(error) {
    res.status(500).json({error:"Something went wrong with the server, please send emotional support Monster Munches"})
    console.error(error)
  }
})

module.exports = router