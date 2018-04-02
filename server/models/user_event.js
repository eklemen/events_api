'use strict';
module.exports = (sequelize, DataTypes) => {
  var User_Event = sequelize.define('User_Event', {
    User_rowId: DataTypes.INTEGER,
    Event_rowId: DataTypes.INTEGER,
    user_role: DataTypes.STRING,
    user_permission: DataTypes.STRING
  }, {});
  User_Event.associate = function(models) {
    // associations can be defined here
  };
  return User_Event;
};