// Module utilitaire
const { verifyToken } = require('../utils/jwt');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config()

// S'assure que le client est authentifié
function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''; // Récupération du token dans les en-têtes
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {

    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  console.log(`Attempting to read ${token} with ${process.env.SECRET}`)

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.auth = {
      userId: String(decoded.sub),
      role: decoded.role || 'user',
    };
    console.log("Decoding token...")
    req.user = decoded;
    console.log(`->${req.auth.userId}<->${req.auth.role}`)
    console.log(`${decoded} for ${req.user}- Proceed.`)
    return next();
  } catch (e) {
    console.error(e)
    return res.status(401).json({ error: 'Bad token' });
  }
}

// Autorisation d'accès aux ressources en fonction de l'utilisateur.ice
function allowSelfOrAdmin(req, res, next) {
   const header = req.headers.authorization || ''
   const token = header.startsWith('Bearer ') ? header.slice(7) : null;

   if (!token) {
    return res.status(401).json({error:"Missing or invalid Authorization header"})
   }
   try {
    const decoded = jwt.verify(token, process.env.SECRET)
    req.user = decoded
   } catch(e) {
    console.error("fuck")
   }
};

// Vérification par rôle ; permet la scission entre les utilisateur.ices et les administrateur.ices
function requireRole(req,res,next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({error:"Missing or invalid Authorization header"})
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    req.user = decoded;

  } catch(e) {
    console.error(e)
    return res.status(401).json({error:'Bad token'});
  }
}

module.exports = { requireAuth, requireRole };