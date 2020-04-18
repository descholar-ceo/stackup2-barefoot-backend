module.exports = (sequelize, DataTypes) => {
  const notificationType = sequelize.define('notificationType', {
    category: DataTypes.STRING,
    message: DataTypes.STRING,
  }, {});
  notificationType.associate = models => {
    notificationType.hasMany(models.notification, {
      as: 'notifications',
      foreignKey: 'typeId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return notificationType;
};
