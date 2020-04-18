module.exports = (sequelize, DataTypes) => {
  const notification = sequelize.define('notification', {
    requesterId: DataTypes.INTEGER,
    requestId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    unread: DataTypes.BOOLEAN
  }, {});
  notification.associate = models => {
    notification.belongsTo(models.notificationType, {
      as: 'type',
      foreignKey: 'typeId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    notification.belongsTo(models.request, {
      as: 'request',
      foreignKey: 'requestId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };
  return notification;
};
