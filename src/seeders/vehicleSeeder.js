module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('vehicles', [

      {
        registration: 'AA123BB',
        make: 'Renault',
        model: 'Clio',
        year: 2020,
        rentalPrice: 45.00
      },
      {
        registration: 'CC456DD',
        make: 'Peugeot',
        model: '208',
        year: 2021,
        rentalPrice: 48.50
      },
      {
        registration: 'EE789FF',
        make: 'Citroën',
        model: 'C3',
        year: 2019,
        rentalPrice: 42.00
      },
      {
        registration: 'GG012HH',
        make: 'Volkswagen',
        model: 'Golf',
        year: 2022,
        rentalPrice: 60.00
      },
      {
        registration: 'II345JJ',
        make: 'Audi',
        model: 'A3',
        year: 2023,
        rentalPrice: 85.00
      },
      {
        registration: 'KK678LL',
        make: 'BMW',
        model: 'Serie 1',
        year: 2021,
        rentalPrice: 90.00
      },
      {
        registration: 'MM901NN',
        make: 'Mercedes',
        model: 'Classe A',
        year: 2022,
        rentalPrice: 95.00
      },
      {
        registration: 'OO234PP',
        make: 'Ford',
        model: 'Focus',
        year: 2018,
        rentalPrice: 38.00
      },
      {
        registration: 'QQ567RR',
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        rentalPrice: 55.00
      },
      {
        registration: 'SS890TT',
        make: 'Nissan',
        model: 'Qashqai',
        year: 2019,
        rentalPrice: 70.00
      },

      {
        registration: 'UU111VV',
        make: 'Hyundai',
        model: 'Tucson',
        year: 2022,
        rentalPrice: 75.00
      },
      {
        registration: 'WW222XX',
        make: 'Kia',
        model: 'Sportage',
        year: 2023,
        rentalPrice: 80.00
      },
      {
        registration: 'YY333ZZ',
        make: 'Skoda',
        model: 'Octavia',
        year: 2021,
        rentalPrice: 52.00
      },
      {
        registration: 'A1444B2',
        make: 'Volvo',
        model: 'XC60',
        year: 2024,
        rentalPrice: 110.00
      },
      {
        registration: 'C3555D4',
        make: 'Mazda',
        model: 'CX-5',
        year: 2020,
        rentalPrice: 65.00
      },
      {
        registration: 'E5666F6',
        make: 'Fiat',
        model: '500',
        year: 2017,
        rentalPrice: 30.00
      },
      {
        registration: 'G7777H8',
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        rentalPrice: 150.00
      },
      {
        registration: 'I9888J0',
        make: 'Porsche',
        model: 'Macan',
        year: 2024,
        rentalPrice: 200.00
      },
      {
        registration: 'K1999L2',
        make: 'Subaru',
        model: 'Forester',
        year: 2021,
        rentalPrice: 70.00
      },
      {
        registration: 'M3000N4',
        make: 'Jeep',
        model: 'Renegade',
        year: 2019,
        rentalPrice: 60.00
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('vehicles', null, {});
  }
};
// npx sequelize-cli db:seed:all --config sequelize.config.js --seeders-path src/seeders

