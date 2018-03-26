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
      ig_profile_pic: {
        type: Sequelize.STRING,
      },
      ig_full_name: {
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
      is_vendor: {
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};
