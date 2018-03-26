'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Events', [{
      uuid: '7e0299e1-a8ba-478d-9250-7e46d168becd',
      is_deleted: false,
      venue: 'A barn outside',
      event_date: '2018-10-10',
      title: 'Wedding1',
      client_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    },{
      uuid: '5b8a18e2-2eaf-4828-8821-d5fa668b0406',
      is_deleted: false,
      venue: '55 W Orlando',
      event_date: '2018-02-12',
      title: 'Corporate Ball',
      client_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
