
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('accommodationUserReactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accommodationId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      isLike: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      isDislike: {
        allowNull: false,
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
    }, {
      uniqueKeys: {
        userIdAccommodationId: {
          fields: ['userId', 'accommodationId']
        }
      }
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('accommodationUserReactions')
};
