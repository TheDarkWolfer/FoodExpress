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
    return res.status(401).json({ error: 'Missing or invalid Authorization header'});
  }

  try {
    // On décode le token pour pouvoir vérifier sa validité, et aussi récupérer les données qu'il contient.
    const decoded = jwt.verify(token, process.env.SECRET);
    req.auth = {
      username: String(decoded.username),
      userId: String(decoded.sub),
      role: decoded.role || 'user',
    };
    //console.log("Decoding token...") // Gardé en commentaire pour faciliter tout débuggage futur
    req.user = decoded;


    /*
    Si il y a une partie "authentification", on vérifie deux choses :
      - Si l'ID du token est la même que celle que l'utilisateur.ice dans l'URL de la requête
      - Sinon, si le rôle est bien celui d'un.e admin
    Sinon, (le résultat par "défaut"), on refuse l'accès
    */
    if (req.auth.userId === req.params.id || req.auth.role === "admin") {
      return next();
    }

    return res.status(403).json({error:"Access forbidden to this ID, sorry"})
    
  } catch (e) {
    // Et en cas de résultat inattendu (normalement il devrait pas y en avoir), on le log et le transmet à l'utilisateur.ice
    console.error(e)
    return res.status(400).json({ error: "Please don't break our API '~'" });
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
    console.error(e)
    return res.status(401).json({error:"Missing Authorization header"});
   }
};

// Vérification par rôle ; permet la scission entre les utilisateur.ices et les administrateur.ices
function requireRole(req,res,next,desiredRole) {
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