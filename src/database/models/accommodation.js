
module.exports = (sequelize, DataTypes) => {
  const accommodation = sequelize.define('accommodation', {
    name: DataTypes.STRING
  }, {});
  accommodation.associate = models => { 
    accommodation.hasMany(models.booking, {
      as: 'bookings',
      foreignKey: 'accommodationId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return accommodation;
};
