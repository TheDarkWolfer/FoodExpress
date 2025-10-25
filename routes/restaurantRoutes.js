const express = require("express");
const jwt = require("jsonwebtoken");
const Restaurants = require("../models/RESTAURANTS.js")
const { RestaurantsCreate, RestaurantsUpdate } = require("../validators/restaurants-validator.js");

// Middleware 
//const auth = require("./middleware/auth");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(express.json());

// swagger voir restaurant 
/**
 * @swagger
 * /restaurants/<ID>:
 *  get:
 *    summary: Accès aux données restaurant
 *    description: Permet la lecture resataurant
 *    security:
 *      - bearerAuth: []
 *    parameters: 
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID du restaurant à afficher
 *        schema:
 *          type: string
 *          example: 68f8f09b07afe91a0a2b6e5d
 * 
 *    responses:
 *      200:
 *        description: Données restaurant affichées
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Restaurants'
 *      404:
 *        description: Restaurant non trouvé
 *      
 */
// voir tous les restaurants
router.get("/",async (req,res) => {
  try {
    // Extraction des paramètres de requête avec valeurs par défaut
    const { search = "", sortBy = "name", order = "asc", limit = 10, page = 1 } = req.query;

    // Création de l'expression régulière pour la recherche
    const searchRegex = new RegExp(search, "i");
    const filter = {
      $or: [
        { name: { $regex: searchRegex } },
        { address: { $regex: searchRegex } }
      ]
    };

    // Détermination de l’ordre de tri (ascendant ou descendant)
    const sortOrder = order === "desc" ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Requête avec filtre, tri et pagination
    const _Restaurant = await Restaurants.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));
  return res.status(200).json(_Restaurant)
  } catch {
    return res.status(300).json({error:"Not allowed !"})
  }
})

// swagger création de restaurant
/**
 * @swagger
 * /restaurants:
 *  post:
 *   summary: Création de restaurant
 *   description: Création de restaurant
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/RestaurantsCreate'
 *      
 *   responses:
 *     201:
 *       description: Restaurant créé
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items: 
 *               $ref: '#/components/schemas/Restaurants'
 *     400:
 *       description: Erreur de validation
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     409:
 *       description: Erreur car duplicata du restaurant
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */
// Création de restaurant 
router.post("/",  requireAuth, async (req, res) => {
  // Validation des données 
  if (!req.body) { 
    return res.status(400).json({error:"Missing request body !"})
  }
  
  const { error, value } = RestaurantsCreate.validate(req.body);
  if (error) {
    // Pour l'erreur 
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }

  const newRestaurants = await Restaurants.create(value);
  res.status(201).json(newRestaurants);
});

// swagger lecture restaurants 
/** 
 @swagger
 * /restaurants:
 *  get:
 *    summary: Gestion des restaurant
 *    description: Pour débugger, renvoie un array avec les restaurants et leur IDs, name, adresse, phone et heure d'ouverture
 *    responses:
 *      200:
 *        description: Array de/restaurants
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Restaurants'
 *      403:
 *        description: Tentative d'accès au noeud en production
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
// Lecture restaurant 
router.get("/:id", requireAuth, async (req, res) => {
  const _Restaurant = await Restaurants.findById(req.params.id);
  if (!_Restaurant) return res.status(404).json({ message: "Restaurant not found" });
  res.json(_Restaurant);
});

// swagger patch restaurant
/**
 * @swagger
 * /restaurants/<ID>:
 *  patch:
 *    description: Modification de restaurant
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID du restaurant à modifier
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Restaurants'
 *    responses:
 *      400:
 *        description: Erreur de validation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      404:
 *        description: Restaurant non trouvé
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 * 
 *      200:
 *       description: Données Restaurant modifiées
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items: 
 *               $ref: '#/components/schemas/Restaurants'
 *              
 */

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

// swagger restaurants suppression
/**
 *  @swagger
 *  /restaurants/<ID>:
 *    delete:
 *      description: Suppression de restaurants
 *      security: 
 *        - bearerAuth: []
 *      parameters: 
 *        - name: id
 *          in: path
 *          required: true
 *          description: L'ID du restaurant à supprimer
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Restaurants supprimé avec succès
 *  
 *        400:
 *          description: Erreur interne lors de la suppresssion
 *          content:
 *            application/json:
 *              schema:
 *                items:
 *                  $ref: '#/components/schemas/Error'
 *            
 */
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