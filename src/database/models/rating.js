module.exports = (sequelize, DataTypes) => {
  const rating = sequelize.define('rating', {
    accommodationId: DataTypes.INTEGER,
    requestId: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    rates: DataTypes.INTEGER
  });
  rating.associate = (models) => {
    rating.belongsTo(models.accommodation, {
      foreignKey: 'accommodationId'
    });
    rating.belongsTo(models.request, {
      foreignKey: 'requestId'
    });
  };
  return rating;
};
