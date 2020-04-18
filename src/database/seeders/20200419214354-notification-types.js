module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('notificationTypes', [
    {
      category: 'create request',
      message: 'Trip request created',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      category: 'update request',
      message: 'Updated trip requests',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      category: 'comment request',
      message: 'Trip request comments',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      category: 'approve request',
      message: 'Trip requests approved',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      category: 'reject request',
      message: 'Trip requests rejected',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      category: 'assign trip request',
      message: 'Trip requests assigned',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('notificationTypes', null, {})
};
