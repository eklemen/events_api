'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      ig_username: {
        type: Sequelize.STRING,
        unique: true
      },
      ig_id: {
        type: Sequelize.STRING,
      },
      fb_username: {
        type: Sequelize.STRING,
        unique: true
      },
      fb_id: {
        type: Sequelize.STRING,
      },
      token: {
        type: Sequelize.STRING,
      },
      business_name: {
        type: Sequelize.STRING,
      },
      provider: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};
