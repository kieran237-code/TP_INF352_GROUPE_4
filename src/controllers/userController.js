const User = require('../models/user');
const { UniqueConstraintError } = require('sequelize');
const bcrypt = require('bcrypt'); // ou 'bcryptjs' si tu préfères
const jwt = require('jsonwebtoken');


module.exports = {
  // 1. Récupérer tous les utilisateurs
  getAll: async (req, res) => {
    try {
      const list = await User.findAll({ attributes: { exclude: ['password'] } });
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 2. Créer un utilisateur avec mot de passe hashé
  create: async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        ...req.body,
        password: hashedPassword
      });
      const userWithoutPassword = user.toJSON();
      delete userWithoutPassword.password;

      res.status(201).json(userWithoutPassword);
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        res.status(409).json({
          error: `Un utilisateur avec le nom '${req.body.name}' existe déjà.`
        });
      } else {
        res.status(400).json({ error: err.message });
      }
    }
  },

  // 3. Mettre à jour un utilisateur (et hacher le mot de passe si modifié)
  update: async (req, res) => {
    try {
      const id_temp = req.params.id;
      const updates = { ...req.body };
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
      const [updated] = await User.update(updates, {
        where: { id: id_temp }
      });
      if (!updated) return res.status(404).json({ error: 'Utilisateur non trouvé' });

      const user = await User.findByPk(id_temp, {
        attributes: { exclude: ['password'] }
      });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },


  login: async (req, res) => {
    const { name, password } = req.body;
    try {
      const user = await User.scope('withPassword').findOne({ where: { name } });
      if (!user) return res.status(401).json({ error: 'Utilisateur introuvable' });

      

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

      // Crée le token :
      
      const accessToken = jwt.sign(
        { id: user.id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

       // Envoyer le refreshToken dans un cookie sécurisé
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ accessToken }); //  renvoie le token au client
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  refresh: async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: 'Token de rafraîchissement manquant' });

    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findByPk(payload.id);
      if (!user) return res.status(401).json({ error: 'Utilisateur introuvable' });

      const newAccessToken = jwt.sign(
        { id: user.id, name: user.name ,nonce:Date.now(),},
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.json({ accessToken: newAccessToken });
    } catch (err) {
      res.status(403).json({ error: 'Token de rafraîchissement invalide ou expiré' });
    }
  },

  // 6. Déconnexion (supprime le cookie refreshToken)
  logout: (req, res) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });
    res.status(204).send();
  }
};
