const bcrypt = require('bcrypt'); 
module.exports = {
  async up (queryInterface, Sequelize) {
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const user1Password = await bcrypt.hash('pass_user1', 10);
    const user2Password = await bcrypt.hash('pass_user2', 10);
    const user3Password = await bcrypt.hash('pass_user3', 10);
    const user4Password = await bcrypt.hash('pass_user4', 10);
    const user5Password = await bcrypt.hash('pass_user5', 10);
    const user6Password = await bcrypt.hash('pass_user6', 10);
    const user7Password = await bcrypt.hash('pass_user7', 10);
    const user8Password = await bcrypt.hash('pass_user8', 10);
    const user9Password = await bcrypt.hash('pass_user9', 10);
    const user10Password = await bcrypt.hash('pass_user10', 10);
    const user11Password = await bcrypt.hash('pass_user11', 10);
    const user12Password = await bcrypt.hash('pass_user12', 10);
    const user13Password = await bcrypt.hash('pass_user13', 10);
    const user14Password = await bcrypt.hash('pass_user14', 10);
    const user15Password = await bcrypt.hash('pass_user15', 10);
    const user16Password = await bcrypt.hash('pass_user16', 10);
    const user17Password = await bcrypt.hash('pass_user17', 10);
    const user18Password = await bcrypt.hash('pass_user18', 10);
    const user19Password = await bcrypt.hash('pass_user19', 10);
    const user20Password = await bcrypt.hash('pass_user20', 10);


    await queryInterface.bulkInsert('users', [
      {
        name: 'admin',
        password: adminPassword
      },
      {
        name: 'Alice',
        password: user1Password
      },
      {
        name: 'Bob',
        password: user2Password
      },
      {
        name: 'Carol',
        password: user3Password
      },
      {
        name: 'David',
        password: user4Password
      },
      {
        name: 'Eve',
        password: user5Password
      },
      {
        name: 'Frank',
        password: user6Password
      },
      {
        name: 'Simon',
        password: user7Password
      },
      {
        name: 'Robert',
        password: user8Password
      },
      {
        name: 'Bernard',
        password: user9Password
      },
      {
        name : 'Loic',
        password: user10Password
      },
      {
        name:'Marie',
        password: user11Password 
      },
      {
        name: 'Lorraine',
        password : user12Password
      },
      {
        name:'Alias',
        password: user13Password
      },
      {
        name:'Kiki',
        password: user14Password
      },
      {
        name: 'Paul',
        password: user14Password
      },
      {
        name:'Lionel',
        password: user15Password
      },
      {
        name: 'Perla',
        password: user16Password
      },
      {
        name:'Aziz',
        password: user17Password
      },
      {
        name:'Bruno',
        password: user18Password
      },
      {
        name:'Florian',
        password: user19Password
      },
      {
        name : 'Marc',
        password: user20Password
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
