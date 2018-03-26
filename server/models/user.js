'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {type: DataTypes.STRING, unique: true},
    // IG
    igUsername: {
      type: DataTypes.STRING, unique: true,
      field: 'ig_username',
    },
    igId: {
      type: DataTypes.STRING,
      field: 'ig_id',
    },
    igProfilePic: {
      type: DataTypes.STRING,
      field: 'ig_profile_pic',
    },
    igFullName: {
      type: DataTypes.STRING,
      field: 'ig_full_name',
    },
    // FB
    fb_username: {type: DataTypes.STRING, unique: true},
    fb_id: {type: DataTypes.STRING},
    token: {type: DataTypes.STRING},
    business_name: {type: DataTypes.STRING},
    provider: {type: DataTypes.STRING},
    isVendor: {type: DataTypes.BOOLEAN, field: 'is_vendor'},
  }, {underscored: true});
  User.associate = (models) => {
    User.hasMany(models.Event);
  };
  return User;
};
