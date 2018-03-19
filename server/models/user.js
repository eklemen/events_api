'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {type: DataTypes.STRING, unique: true},
    instagram: {type: DataTypes.STRING, unique: true},
    facebook: {type: DataTypes.STRING, unique: true},
    business_name: {type: DataTypes.STRING},
  }, {underscored: true});

  return User;
};
