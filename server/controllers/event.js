const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {Event, EventUser, User} = require('../models');
const include = require('./constants');

module.exports = {
  create: async (req, res) => {
    const {
      body:{venue, eventDate, title, userRole='vendor'},
      tokenBearer: userId
    } = req;
    try {
      const {dataValues: {id: eventId}} = await Event
        .create({
          venue,
          eventDate,
          title,
          creator_id: userId,
        });
      // Add user to the list of members
      await EventUser.create({
        User_rowId: userId,
        Event_rowId: eventId,
        userPermission: 'edit',
        userRole: userRole.toLowerCase(),
      });
      const event = await Event.findById(eventId, {
        attributes: include.eventAttrs,
        include: include.all
      });
      if(!event) return res.status(500).send({message: 'Internal server error'});
      return res.status(200).send(event)
    } catch (err) {
      return res.status(500).send({
        err,
        message: 'Unable to create Event.',
      })
    }
  },
  list(_req, res) {
    return Event
      .findAll({
        where: {
          isDeleted: false
        },
        attributes: include.eventAttrs,
        include: include.all
      })
      .then(events => res.status(200).send(events))
      .catch(error => res.status(400).send(error));
  },
  getOne: async(req, res) => {
    try {
      const event = await Event
        .findOne({
          where: {uuid: req.params.uuid},
          include: include.all
        });
      if (!event) {
        return res.status(404).send({
          message: 'ERROR: Event with this uuid does not exist.',
          status: 404
        })
      }
      return res.status(200).send(event)
    } catch (err) {
      return res.status(500).send(err)
    }
  },
  update: async (req, res) => {
    try {
      const [_, {dataValues}] = await Event
        .update(
          {...req.body},
          {where: {uuid: req.params.uuid},
            returning: true,
            plain: true,
            include: include.all
          });
      const updatedEvent = await Event
        .findById(dataValues.id, {
          include: include.all
        });
      return res.status(200).send(updatedEvent);
    } catch (err) {
      return res.status(400).send({
        message: 'Event not found'
      });
    }
  },
  softDelete: async (req, res) => {
    try {
      // const event = await Event
      //   .findOne({
      //     where: {uuid: req.params.uuid},
      //   });
      // const response = res.status(200).send({success: true});
      // if (!event) return res.status(400).send({success: true});
      await Event.update({where: {uuid: req.params.uuid},}, {isDeleted: true});
      return res.status(200).send({success: true});
    } catch (err) {
      return res.status(500).send({
        error: err,
        message: 'Internal server error',
      })
    }
  }
};