const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  registration: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  make: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate:{
      min:1600,
      max:2025,
    },
  },
  rentalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate:{
      min:0,
      max:50000000,
    },
  },
}, {
  tableName: 'vehicles',
  timestamps: false,
});

module.exports = Vehicle;