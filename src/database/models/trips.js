
module.exports = (sequelize, DataTypes) => {
  const trips = sequelize.define('trips', {
    travelFrom: DataTypes.STRING,
    travelTo: DataTypes.STRING,
    travelDate: DataTypes.DATEONLY,
    returnDate: DataTypes.DATEONLY,
  }, {});
  trips.associate = (models) => {
    trips.belongsTo(models.request, {
      foreignKey: 'requestId',
      as: 'request',
      timestamps: true,
    });
  };
  return trips;
};
