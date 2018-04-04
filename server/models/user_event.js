'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserEvent = sequelize.define('UserEvent', {
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
  UserEvent.associate = function(models) {
    // associations can be defined here
  };
  // UserEvent.sync({force: true});
  return UserEvent;
};