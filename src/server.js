const app = require('./app');
const sequelize = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

require('./models/vehicle');
require('./models/user');

const cors = require('cors');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à MySQL réussie.');

    await sequelize.sync({ force: false });// cree les tables si elles n'existent pas 
    console.log('Base de données synchronisée.')
    
    app.use(cors());    
    
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur de connexion à la base de données :', error);
  }
})();