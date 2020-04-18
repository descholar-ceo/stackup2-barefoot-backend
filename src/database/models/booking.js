
module.exports = (sequelize, DataTypes) => {
  const booking = sequelize.define('booking', {
    tripRequestId: DataTypes.NUMBER,
    accommodationId: DataTypes.NUMBER,
    arrivalDate: DataTypes.DATEONLY,
    departureDate: DataTypes.DATEONLY
  }, {});
  booking.associate = models => { 
    booking.belongsTo(models.accommodation, {
      as: 'accommodation',
      foreignKey: 'accommodationId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    booking.belongsTo(models.request, {
      as: 'request',
      foreignKey: 'tripRequestId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };
  return booking;
};
