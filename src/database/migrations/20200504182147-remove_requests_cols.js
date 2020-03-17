
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
      queryInterface.removeColumn('requests', 'travelFrom'),
      queryInterface.removeColumn('requests', 'travelTo'),
      queryInterface.removeColumn('requests', 'travelDate'),
      queryInterface.removeColumn('requests', 'returnDate'),
      queryInterface.removeIndex('requests', 'uniqueKeys'),
    ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'requests',
      'travelFrom',
      {
        allowNull: true,
        type: Sequelize.STRING
      }
    ),
    queryInterface.addColumn(
      'requests',
      'travelTo',
      {
        allowNull: true,
        type: Sequelize.STRING
      }
    ),
    queryInterface.addColumn(
      'requests',
      'travelDate',
      {
      allowNull: true,
      type: Sequelize.DATEONLY
      }
    ),
    queryInterface.addColumn(
      'requests',
      'returnDate',
      {
      allowNull: true,
      type: Sequelize.DATEONLY
      }
    ),
    queryInterface.addIndex('requests', ['userId', 'travelDate']),
  ]),
};
