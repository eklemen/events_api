'use strict';
module.exports = (sequelize, DataTypes) => {
  const EventUser = sequelize.define('EventUser', {
    UserRowId: {
      type: DataTypes.INTEGER,
      field: 'User_rowId',
    },
    EventRowId: {
      type: DataTypes.INTEGER,
      field: 'Event_rowId',
    },
    userRole: {
      type: DataTypes.STRING,
      field: 'user_role',
    },
    userPermission: {
      type: DataTypes.STRING,
      field: 'user_permission',
    },
  }, {underscored: true});
  EventUser.associate = function(models) {
    // associations can be defined here
  };
  // EventUser.sync({force: true});
  return EventUser;
};