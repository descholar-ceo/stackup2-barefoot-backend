
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('accommodation', [{
      id: 1,
      name: 'uno',
      createdAt: '2020-03-15',
      updatedAt: '2020-03-15',
    },
    {
      id: 2,
      name: 'kehda',
      createdAt: '2020-03-15',
      updatedAt: '2020-03-15',
    },
    {
      id: 3,
      name: 'serena',
      createdAt: '2020-03-15',
      updatedAt: '2020-03-15',
    }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('accommodation', null, {})
};
