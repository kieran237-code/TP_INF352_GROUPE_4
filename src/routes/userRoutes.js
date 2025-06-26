// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');

// Authentification
router.post('/register', ctrl.create); // ou renommer create en register
router.post('/login', ctrl.login);     // login à ajouter dans userController
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

// Gestion utilisateurs (admin ?)
router.get('/', ctrl.getAll);         // GET /users
router.put('/:id', ctrl.update);      // PUT /users/:id

module.exports = router;