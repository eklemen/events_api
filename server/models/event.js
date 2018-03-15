'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    venue: {
      type: DataTypes.STRING,
      allowNull: false
    },
    event_date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {underscored: true});
  Event.associate = models => {
    Event.belongsTo(models.Client, {
      foreignKey: 'client_id',
      as: 'client'
    });
  };
  return Event;
};