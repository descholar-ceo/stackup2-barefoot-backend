
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      requesterId: {
        type: Sequelize.INTEGER
    },
    requestId: {
      type: Sequelize.INTEGER
    }, 
    typeId: {
      type: Sequelize.INTEGER
    }, 
    unread: {
      type: Sequelize.BOOLEAN
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('notifications')
};
