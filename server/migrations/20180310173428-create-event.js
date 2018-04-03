'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Events', {
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
      is_deleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      venue: {
        type: Sequelize.STRING
      },
      event_date: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      creator_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
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
  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('UserEvents');
    return queryInterface.dropTable('Events');
  }
};