// src/routes/vehicleRoutes.js
 // ici nous j'affecte chacunes des méthodes defini dans le controller à une route specifique

 // les routes seront utilisée sous forme de requete https une fois le server lancé
// src/routes/vehicleRoutes.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/vehicleController');
const auth = require('../../middlewares/authMiddleware');

// Recherches
router.get('/prix',               ctrl.getByPriceRange);      // Statique d'abord
router.get('/:registration',      ctrl.getByRegistration);    // Dynamique ensuite
router.get('/',                   ctrl.getAll);               // Get all vehicles

// CRUD - routes protégées
router.post('/',                  auth, ctrl.create);         // Create vehicle
router.put('/:registration',      auth, ctrl.update);         // Update by registration
router.delete('/:registration',   auth, ctrl.remove);         // Delete by registration

module.exports = router;
