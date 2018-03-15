'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    company: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {underscored: true});
  Client.associate = (models) => {
    Client.hasMany(models.Event);
  };
  return Client;
};