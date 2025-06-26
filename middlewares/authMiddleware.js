// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Format attendu : "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // clé secrète dans .env
    req.user = decoded; // ajoute l'utilisateur à la requête
    next(); // continue vers la route protégée
  } catch (err) {
    res.status(403).json({ error: 'Token invalide' });
  }
};
