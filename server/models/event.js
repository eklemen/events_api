'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_deleted'
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventDate: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'event_date',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
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