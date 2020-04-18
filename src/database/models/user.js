
import roles from '../../utils/userRoles.utils';

const {
  MANAGER,
  REQUESTER,
  SUPER_USER,
  SUPER_ADMIN,
  TRAVEL_ADMIN,
  TRAVEL_TEAM_MEMBER,
 } = roles;
export default (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    socialMediaId: DataTypes.STRING,
    provider: DataTypes.STRING,
    gender: DataTypes.STRING,
    address: DataTypes.STRING,
    role: DataTypes.ENUM(
      SUPER_USER, 
      SUPER_ADMIN, 
      TRAVEL_ADMIN, 
      TRAVEL_TEAM_MEMBER, 
      MANAGER, 
      REQUESTER
      ),
    isVerified: DataTypes.BOOLEAN,
    emailNotification: DataTypes.BOOLEAN,
    inAppNotification: DataTypes.BOOLEAN,
    birthDate: DataTypes.DATE,
    preferredLanguage: DataTypes.STRING,
    preferredCurrency: DataTypes.STRING,
    department: DataTypes.STRING,
    lineManager: DataTypes.INTEGER,
    idCardNumber: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    profileImage: DataTypes.STRING,
  }, {});

  user.associate = (models) => {
    user.hasMany(models.request, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return user;
};
