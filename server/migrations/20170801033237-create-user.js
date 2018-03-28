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
      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      phone: {
        type: Sequelize.STRING,
      },
      ig_id: {
        type: Sequelize.STRING,
      },
      ig_username: {
        type: Sequelize.STRING,
        unique: true
      },
      ig_full_name: {
        type: Sequelize.STRING,
      },
      ig_token: {
        type: Sequelize.STRING,
      },
      profile_picture: {
        type: Sequelize.STRING,
      },
      fb_username: {
        type: Sequelize.STRING,
        unique: true
      },
      fb_id: {
        type: Sequelize.STRING,
      },
      fb_token: {
        type: Sequelize.STRING,
      },
      business_name: {
        type: Sequelize.STRING,
      },
      provider: {
        type: Sequelize.STRING,
      },
      is_deleted: {
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
