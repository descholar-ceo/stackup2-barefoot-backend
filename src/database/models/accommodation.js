
module.exports = (sequelize, DataTypes) => {
  const accommodation = sequelize.define('accommodation', {
    name: DataTypes.STRING
  }, {});
  accommodation.associate = (models) => {
    accommodation.hasMany(models.rating, {
      foreignKey: 'accommodationId',
      onUpdate: 'CASCADE'
    });
  };
  return accommodation;
};
