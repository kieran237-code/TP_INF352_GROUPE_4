const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Important si tu ne l’utilises pas comme UUID
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Évite les doublons de login
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
  //  
  defaultScope: {
    attributes: { exclude: ['password'] }, // Cache le mot de passe par défaut
  },
  scopes: {
    withPassword: {
      attributes: ['id', 'name', 'password'],
    },
}

});

module.exports = User;
