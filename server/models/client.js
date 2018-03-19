'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    company: DataTypes.STRING,
    phone: DataTypes.STRING,
  }, {underscored: true});
  Client.associate = (models) => {
    Client.hasMany(models.Event);
  };
  return Client;
};