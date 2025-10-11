// Module utilitaire
const { verifyToken } = require('../utils/jwt');

// S'assure que le client est authentifié
function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Bad token' });
  }
}

// Vérification par rôle ; permet la scission entre les utilisateur.ices et les administrateur.ices
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Wrong role for action' });
    }
    next();
  };
}

module.exports = { authRequired, requireRole };