const Sequelize = require('sequelize');
const db = require('../models');
const Op = Sequelize.Op;
const Event = require('../models').Event;
const Client = require('../models').Client;
const eventAttrs = ['uuid', 'venue', 'event_date', 'title'];
const clientAttrs = ['uuid', 'first_name', 'last_name', 'company', 'phone'];
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
        .spread(client => {
          const {venue, eventDate, title} = req.body;
          return Event
            .create({
              venue: venue,
              event_date: eventDate,
              title: title,
              client_id: client.dataValues.id,
            }, {transaction: t});
        })
        .catch(error => res.status(500).send(error))
    })
      .then(e => {
        return Event.findById(e.id, {
          attributes: eventAttrs,
          include: [
            {
              model: Client,
              as: 'client',
              attributes: clientAttrs
            }
          ]
        })
          .then(event => res.status(200).send(event))
          .catch(error => res.status(404).send(error))
      })
      .catch(error => res.status(500).send({
        error: 'There was an error with the event creation transaction. Ensure the client info or event keys are properly formatted.'
      }));
  },
  list(_req, res) {
    return Event
      .findAll({
        where: {
          is_deleted: false
        },
        attributes: eventAttrs,
        include: [
          {
            model: Client,
            as: 'client',
            attributes: clientAttrs
          }
        ]
      })
      .then(events => res.status(200).send(events))
      .catch(error => res.status(400).send(error));
  },
  getOne(req, res) {
    return Event
      // should getOne exclude deleted items by default?
      .findOne({
        where: {uuid: req.params.uuid},
        attributes: eventAttrs,
        include: [
          {
            model: Client,
            as: 'client',
            attributes: clientAttrs
          }
        ]
      })
      .then(event => {
        if(!event) {
          return res.status(404).send({
            message: 'ERROR: Event with this uuid does not exist.',
            status: 404
          })
        }
        return res.status(200).send(event)
      })
      .catch(error => res.status(500).send(error));
  },
  update(req, res) {
    return Event
      .findOne({
        where: {uuid: req.params.uuid},
        include: [
          {
            model: Client,
            as: 'client',
            attributes: clientAttrs
          }
        ]
      })
      .then(event => {
        if (!event) {
          return res.status(404).send({
            message: 'ERROR: Event with this uuid does not exist.',
            status: 404
          });
        }
        return event
          .update({
            venue: req.body.venue || event.venue,
            event_date: req.body.eventDate || event.event_date,
            title: req.body.title || event.title,
          })
          .then(event => {
            const {uuid, venue, event_date, title, client} = event;
            return res.status(200).send({uuid, venue, event_date, title, client})
          })
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(500).send({
        status: 500,
        error,
        message: 'ERROR: Internal server error'
      }));
  },
  softDelete(req, res) {
    return Event
      .findOne({
        where: {uuid: req.params.uuid},
      })
      .then(event => {
        if (!event) return res.status(200).send({success: true});
        return event
          .update({
            isDeleted: true,
          })
          .then(() => {
            return res.status(200).send({success: true})
          })
          .catch((error) => res.status(500).send(error));
      })
      .catch((error) => res.status(500).send({
        status: 500,
        error,
        message: 'ERROR: Internal server error'
      }));
  }
};