const Vehicle = require('../models/vehicle');
const { Op } = require('sequelize');
const { UniqueConstraintError } = require('sequelize');

module.exports = {
  // 1. Get all vehicles
  getAll: async (req, res) => {
    try {
      const list = await Vehicle.findAll();
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 2. Create a vehicle

  create: async (req, res) => {
    try {
      const v = await Vehicle.create(req.body);
      res.status(201).json(v);
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        res.status(409).json({
          error: `Un véhicule avec l'immatriculation '${req.body.registration}' existe déjà.`
        });
      }else {
        res.status(400).json({ error: err.message });
      }
    }
  },


  // 3. Update a vehicle (by registration)
  update: async (req, res) => {
    try {
      const reg = req.params.registration;
      const [updated] = await Vehicle.update(req.body, {
        where: { registration: reg }
      });
      if (!updated) return res.status(404).json({ error: 'Véhicule non trouvé' });
      const v = await Vehicle.findByPk(reg);
      res.json(v);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // 4. Delete a vehicle (by registration)
  remove: async (req, res) => {
    try {
      const reg = req.params.registration;
      const deleted = await Vehicle.destroy({
        where: { registration: reg }
      });
      if (!deleted) return res.status(404).json({ error: 'Véhicule non trouvé' });
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 5. Search by registration
  getByRegistration: async (req, res) => {
    try {
      const reg = req.params.registration;
      const v = await Vehicle.findByPk(reg);
      if (!v) return res.status(404).json({ error: 'Véhicule non trouvé' });
      res.json(v);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // 6. Search by price range (?min=X&max=Y)
  getByPriceRange: async (req, res) => {
    const min = parseFloat(req.query.min) || 0;
    const max = parseFloat(req.query.max) || Number.MAX_VALUE;
    try {
      const list = await Vehicle.findAll({
        where: {
          rentalPrice: { [Op.between]: [min, max] }
        }
      });
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};