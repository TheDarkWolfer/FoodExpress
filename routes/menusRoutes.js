const express = require("express");
const jwt = require("jsonwebtoken");
const Menus = require("MENUS.js")
const { MenusCreate, MenusUpdate } = require("../validators/Menus.js");

// Middleware
//const auth = require("./middleware/auth");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(express.json());

// voir les Menus
router.get("/",async (req,res) => {
  if (process.env.NODE_ENV === "development") {
    try {
      // Extraction des paramètres de requête avec valeurs par défaut
      const { search = "", sortBy = "name", order = "asc", limit = 10, page = 1 } = req.query;

      // Création de l'expression régulière pour la recherche
      const searchRegex = new RegExp(search, "i");
      const filter = {
        $or: [
          { name: { $regex: searchRegex } },
          { price: { $regex: searchRegex } },
          { category: { $regex: searchRegex } }
        ]
      };
      // Détermination de l’ordre de tri (ascendant ou descendant)
      const sortOrder = order === "desc" ? -1 : 1;

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Requête avec filtre, tri et pagination
      const menus = await Menus.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit));
    return res.status(418).json(Menus)
  } catch {
    return res.status(300).json({error:"Not allowed !"})
  }
}
})



// Création de Menus
router.post("/",  requireAuth,  requireRole("admin"), async (req, res) => {
  // Validation des données envoyées avant création
  const { error, value } = MenusCreate.validate(req.body);
  if (error) {
    // En cas d'erreur, on en informe l'utilisateur.ice
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }

 
  const Menus = await Menus.create(value);
  res.status(201).json(Menus);
});

// Lecture  menus
router.get("/:id", requireAuth, async (req, res) => {
  const Menus = await Menus.findById(req.params.id);
  if (!Menus) return res.status(404).json({ message: "user not found" });
  res.json(Menus);
});

// MAJ de menus, validation des données avec JOI
router.patch("/:id", requireAuth,  requireRole("admin"), async (req, res) => {
  // Validation avec le schéma de mise à jour (champs optionnels)
  const { error, value } = MenusUpdate.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  
  const Menus = await Menus.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!Menus) return res.status(404).json({ message: "User not found" });

  res.json(Menus);
});

// Suppression  Menus
router.delete("/:id", requireAuth,  requireRole("admin"), async (req, res) => {
  try {
    const Menus = await Menus.findByIdAndDelete(req.params.id);
    if (!Menus) return res.status(404).json({ message: "User not found" });
    return res.json({ message: `User ${Menus.name} deleted successfully` });  
  } catch(error) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
});


module.exports = router