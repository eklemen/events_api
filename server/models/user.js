'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {type: DataTypes.STRING, unique: true},
    // IG
    ig_username: {type: DataTypes.STRING, unique: true},
    ig_id: {type: DataTypes.STRING},
    ig_profile_pic: {type: DataTypes.STRING},
    ig_full_name: {type: DataTypes.STRING},
    // FB
    fb_username: {type: DataTypes.STRING, unique: true},
    fb_id: {type: DataTypes.STRING},
    token: {type: DataTypes.STRING},
    business_name: {type: DataTypes.STRING},
    provider: {type: DataTypes.STRING},
    isVendor: {type: DataTypes.BOOLEAN, field: 'is_vendor'},
  }, {underscored: true});

  return User;
};
