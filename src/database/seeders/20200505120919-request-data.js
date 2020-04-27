
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('requests', [{
    userId: 1,
    travelFrom: 'kamembe',
    travelTo: 'kigali',
    travelDate: '2020-04-28',
    returnDate: '2020-06-03',
    travelReason: 'business',
    travelType: 'return-trip',
    status: 'pending',
    accommodation: true,
    handledBy: 1,
    createdAt: new Date(),
    updatedAt: new Date()
      }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('requests', null, {})
};
