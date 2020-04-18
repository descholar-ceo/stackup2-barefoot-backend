module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    
    queryInterface.addColumn('users', 'emailNotification', Sequelize.BOOLEAN),
    queryInterface.addColumn('users', 'inAppNotification', Sequelize.BOOLEAN),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('users', 'emailNotification'),
    queryInterface.removeColumn('users', 'inAppNotification'),
  ])
};
