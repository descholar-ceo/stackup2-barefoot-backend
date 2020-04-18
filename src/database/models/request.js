
module.exports = (sequelize, DataTypes) => {
  const request = sequelize.define('request', {
    userId: DataTypes.INTEGER,
    travelFrom: DataTypes.STRING,
    travelTo: DataTypes.STRING,
    travelDate: DataTypes.DATEONLY,
    returnDate: DataTypes.DATEONLY,
    travelReason: DataTypes.STRING,
    travelType: DataTypes.STRING,
    status: DataTypes.STRING,
    accommodation: DataTypes.BOOLEAN,
    handledBy: DataTypes.INTEGER
  });
  request.associate = (models) => {
    request.hasMany(models.comment, {
      foreignKey: 'requestId',
      onDelete: 'CASCADE'
    });
    request.belongsTo(models.user, { foreignKey: 'userId' });
    request.belongsTo(models.user, {
      foreignKey: 'handledBy'
    });
      request.hasMany(models.notification, { as: 'notifications', foreignKey: 'typeId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  };
  return request;
};
