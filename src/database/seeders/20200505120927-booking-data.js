module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('bookings', [{
    tripRequestId: 1,
    accommodationId: 1,
    arrivalDate: '2020-05-02',
    departureDate: '2020-06-04',
    createdAt: new Date(),
    updatedAt: new Date()
      }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('bookings', null, {})
};
