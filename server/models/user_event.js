'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserEvent = sequelize.define('UserEvent', {
    User_rowId: DataTypes.INTEGER,
    Event_rowId: DataTypes.INTEGER,
    user_role: DataTypes.STRING,
    user_permission: DataTypes.STRING
  }, {});
  UserEvent.associate = function(models) {
    // associations can be defined here
  };
  // UserEvent.sync({force: true});
  return UserEvent;
};