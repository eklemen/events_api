const Sequelize = require('sequelize');
const db = require('../models');
const Op = Sequelize.Op;
const Event = require('../models').Event;
const Client = require('../models').Client;
const User = require('../models').User;
const eventAttrs = ['uuid', 'venue', 'eventDate', 'title'];
const userAttrs = ['uuid', 'email', 'phone', 'igUsername', 'igFullName', 'profilePicture', 'businessName'];
const clientAttrs = ['uuid', 'firstName', 'lastName', 'company', 'phone'];
module.exports = {
  create(req, res) {
    const {venue, eventDate, title} = req.body;
    return Event
      .create({
        venue,
        eventDate,
        title,
        creator_id: req.tokenBearer,
      })
      .then(e => {
        return Event.findById(e.dataValues.id, {
          attributes: eventAttrs,
          include: [
            {
              model: User,
              as: 'creator',
              attributes: userAttrs
            }
          ]
        })
          .then(event => res.status(200).send(event))
          .catch(error => res.status(404).send(error));
      })
      .catch(error => res.status(500).send({
        error,
        message: 'Unable to create Event.',
      }));
  },
  list(_req, res) {
    return Event
      .findAll({
        where: {
          isDeleted: false
        },
        attributes: eventAttrs,
        include: [
          {
            model: User,
            as: 'creator',
            attributes: userAttrs
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
            model: User,
            as: 'creator',
            attributes: userAttrs
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
    const {venue, eventDate, title} = req.body;
    const updateObj = {};
    if('venue' in req.body) updateObj.venue = venue;
    if('eventDate' in req.body) updateObj.eventDate = eventDate;
    if('title' in req.body) updateObj.title = title;
    console.log('---------\n\r', updateObj);
    return Event
      .update(
        updateObj,
        {
          where: {
            uuid: req.params.uuid
          },
          returning: true,
          attributes: eventAttrs,
          include: [
            {
              model: User,
              as: 'creator',
              attributes: userAttrs
            }
          ]
        }
      )
      .spread((_rows, event) => {
        console.log('event.creator------------\n\r', event[0].dataValues);
        const {uuid, venue, eventDate, title, creator} = event[0].dataValues;
        return res.status(200).send({uuid, venue, eventDate, title, creator})
      })
      .catch((error) => res.status(400).send(error));
    // return Event
    //   .findOne({
    //     where: {uuid: req.params.uuid},
    //     attributes: eventAttrs,
    //     include: [
    //       {
    //         model: User,
    //         as: 'creator',
    //         attributes: userAttrs
    //       }
    //     ]
    //   })
    //   .then(event => {
    //     if (!event) {
    //       return res.status(404).send({
    //         message: 'ERROR: Event with this uuid does not exist.',
    //         status: 404,
    //       });
    //     }
    //     const {dataValues: {venue, eventDate, title}} = event;
    //     const {body} = req;
    //     return event
    //       .update({
    //         venue: body.venue         || venue,
    //         eventDate: body.eventDate || eventDate,
    //         title: body.title         || title,
    //       })
    //       .spread((_rows, event) => {
    //         console.log('event.creator------------\n\r', event.creator);
    //         const {uuid, venue, eventDate, title, creator} = event;
    //         return res.status(200).send({uuid, venue, eventDate, title, creator})
    //       })
    //       .catch((error) => res.status(400).send(error));
    //   })
    //   .catch((error) => res.status(500).send({
    //     error,
    //     message: 'ERROR: Internal server error',
    //   }));
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
        error,
        message: 'ERROR: Internal server error',
      }));
  }
};