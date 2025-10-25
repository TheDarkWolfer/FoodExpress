const express = require("express");
const jwt = require("jsonwebtoken");
const Menus = require("../models/MENUS.js")
const { MenusUpdate, MenusCreate } = require("../validators/menus-validator.js");

// Middleware
//const auth = require("./middleware/auth");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(express.json());


// swagger voir menus 
/**
 * @swagger
 * /users/<ID>:
 *  get:
 *    summary: Accès aux données de menu
 *    description: Permet la lecture de menu
 *    security:
 *      - bearerAuth: []
 *    parameters: 
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID du menu à afficher
 *        schema:
 *          type: string
 *          example: 68f8f09b07afe91a0a2b6e5d
 * 
 *    responses:
 *      200:
 *        description: Données menus affichées
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Menu'
 *      404:
 *        description: Menu non trouvé
 *      
 */
// voir les Menus
router.get("/",async (req,res) => {
  if (process.env.NODE_ENV === "development") {
    const menus = await Menus.find()
    return res.status(418).json(menus)
  } else {
    return res.status(300).json({error:"Not allowed !"})
  }
})

// swagger création de menus
/**
 * @swagger
 * /menus:
 *  post:
 *   summary: Création de menu
 *   description: Création de menu
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/MenusCreate'
 *      
 *   responses:
 *     201:
 *       description: Menu créé
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items: 
 *               $ref: '#/components/schemas/Menus'
 *     400:
 *       description: Erreur de validation
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     409:
 *       description: Erreur car duplicata de menu
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */
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


// swagger lecture menus 
/** 
 @swagger
 * /menus:
 *  get:
 *    summary: Gestion des menus
 *    description: Surtout pour débugger, renvoie un array avec les menus et leur IDs, name, description, prix et catégorie
 *    responses:
 *      200:
 *        description: Array de/menus
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Menus'
 *      403:
 *        description: Tentative d'accès au noeud en production
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */

// Lecture  menus
router.get("/:id", requireAuth, async (req, res) => {
  const _Menus = await Menus.findById(req.params.id);
  if (!_Menus) return res.status(404).json({ message: "user not found" });
  res.json(_Menus);
});


// swagger patch menu
/**
 * @swagger
 * /menus/<ID>:
 *  patch:
 *    description: Modification de menu
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID du menu à modifier
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Menus'
 *    responses:
 *      400:
 *        description: Erreur de validation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *      404:
 *        description: Menu non trouvé
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 * 
 *      200:
 *       description: Données Menu modifiées
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items: 
 *               $ref: '#/components/schemas/Menus'
 *              
 */

// MAJ de menus, validation des données avec JOI
router.patch("/:id", requireAuth, async (req, res) => {
  // Validation avec le schéma de mise à jour (champs optionnels)
  const { error, value } = MenusUpdate.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  
  const _Menus = await Menus.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!_Menus) return res.status(404).json({ message: "Menu not found" });

  res.json(_Menus);
});

// swagger menus suppression
/**
 *  @swagger
 *  /menus/<ID>:
 *    delete:
 *      description: Suppression de menus
 *      security: 
 *        - bearerAuth: []
 *      parameters: 
 *        - name: id
 *          in: path
 *          required: true
 *          description: L'ID du menu à supprimer
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Menus supprimé avec succès
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