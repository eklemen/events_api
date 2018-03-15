const Sequelize = require('sequelize');
const db = require('../models');
const Op = Sequelize.Op;
const Event = require('../models').Event;
const Client = require('../models').Client;

module.exports = {
  create(req, res) {
    const {body:{client={}}} = req;
    return db.sequelize.transaction(t => {
      return Client.findOrCreate({
        where: {
          [Op.or]: [
            {
              first_name: client.firstName,
              last_name: client.lastName
            },
            {company: client.company},
            {phone: client.phone}
          ]
        },
        transaction: t,
        defaults: {
          first_name: client.firstName,
          last_name: client.lastName,
          company: client.company,
          phone: client.phone,
        }
      })
        .spread((client, c) => {
          const {venue, eventDate, title} = req.body;
          console.log('list', Object.keys(Event.rawAttributes));
          return Event
            .create({
              venue: venue,
              event_date: eventDate,
              title: title,
              client_id: client.dataValues.id
            }, {transaction: t});
        })
        .catch(error => res.status(500).send(error))
    })
      .then(event => res.status(200).send(event))
      .catch(error => res.status(500).send({
        error: 'There was an error with the event creation transaction. Ensure the client info or event keys are properly formatted.'
      }));
  },
  list(req, res) {
    console.log('list', Object.keys(Event.rawAttributes));
    return Event
      .findAll({ include: [{ all: true }]})
      .then(events => res.status(200).send(events))
      .catch(error => res.status(400).send(error));
  },
};