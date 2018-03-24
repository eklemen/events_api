'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {type: DataTypes.STRING, unique: true},
    ig_username: {type: DataTypes.STRING, unique: true},
    ig_id: {type: DataTypes.STRING},
    fb_username: {type: DataTypes.STRING, unique: true},
    fb_id: {type: DataTypes.STRING},
    token: {type: DataTypes.STRING},
    business_name: {type: DataTypes.STRING},
    provider: {type: DataTypes.STRING},
  }, {underscored: true});

  return User;
};
