
const express = require('express');
require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');


app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Servir les fichiers statiques du dossier 'frontend'

app.use(express.static(path.join(__dirname, '../Front')));


// Import des routes
const vehicleRoutes = require('./routes/vehicleRoutes');
const userRoutes = require('./routes/userRoutes');


// Utilisation des routes API
app.use('/vehicules', vehicleRoutes);
app.use('/users', userRoutes);


// Route d'accueil pour rediriger vers login.html
app.get('/', (req, res) => {
 
  res.sendFile(path.join(__dirname, '../Front', 'login.html'));
});

// Middleware pour gérer les routes non trouvées
app.use((req, res) => {
  
  res.status(404).json({ error: 'Route API non trouvée' });
});

module.exports = app;
console.log('app.js: module.exports = app');
