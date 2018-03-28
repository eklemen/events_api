'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    email: {type: DataTypes.STRING, unique: true},
    phone: DataTypes.STRING,
    // // IG
    igId: {
      type: DataTypes.STRING,
      field: 'ig_id',
    },
    igUsername: {
      type: DataTypes.STRING, unique: true,
      field: 'ig_username',
    },
    igFullName: {
      type: DataTypes.STRING,
      field: 'ig_full_name',
    },
    igToken: {
      type: DataTypes.STRING,
      field: 'ig_token',
    },
    profilePicture: {
      type: DataTypes.STRING,
      field: 'profile_picture',
    },
    // // FB
    fbId: {
      type: DataTypes.STRING,
      field: 'fb_username',
    },
    fbUsername: {
      type: DataTypes.STRING, unique: true,
      field: 'fb_username',
    },
    fbToken: {
      type: DataTypes.STRING,
      field: 'fb_token',
    },
    business_name: {type: DataTypes.STRING},
    provider: {type: DataTypes.STRING},
    isDeleted: {
      type: DataTypes.BOOLEAN,
      field: 'is_deleted',
      defaultValue: false,
    },
  }, {underscored: true});
  User.associate = (models) => {
  };
  return User;
};
