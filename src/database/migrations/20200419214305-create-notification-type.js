module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('notificationTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
  }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('notificationTypes')
  };
