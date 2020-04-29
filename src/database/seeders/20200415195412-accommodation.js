
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('accommodation', [
    {
      id: 1,
      name: 'uno',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'dos',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('accommodation', null, {})
};
