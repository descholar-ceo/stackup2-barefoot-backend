
module.exports = (sequelize, DataTypes) => {
  const { INTEGER, BOOLEAN } = DataTypes;
  const accommodationUserReaction = sequelize.define('accommodationUserReaction', {
    accommodationId: INTEGER,
    userId: INTEGER,
    isLike: BOOLEAN,
    isDislike: BOOLEAN
  }, {});
  accommodationUserReaction.associate = (models) => {
    // associations can be defined here
  };
  return accommodationUserReaction;
};
