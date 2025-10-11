const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'pleasechangeme';
const EXPIRES_IN = process.env.SECRET_EXPIRE || '1h';

function signToken(payload) {
  // Rend un token signé avec le secret de .env (et un délai d'expiration)
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

function verifyToken(token) {
  // Causera une erreur en cas de non-validité
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };