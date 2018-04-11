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
  getOne(req, res) {
    return Event
      // should getOne exclude deleted items by default?
      .findOne({
        where: {
          uuid: req.params.uuid,
          // isDeleted: false,
        },
        include: [
          {
            model: User,
            as: 'creator',
          },
          {
            model: User,
            as: 'members',
            through: {
              attributes: ['userRole', 'userPermission'],
              as: 'memberDetails'
            }
          },
        ]
        // attributes: include.eventAttrs,
        // include: include.all
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
      .update(
        {...req.body},
        {
          where: {
            uuid: req.params.uuid
          },
          returning: true,
          plain: true,
          include: include.all
        }
      )
      .spread((_rows, event) => {
        return Event
          .findById(event.dataValues.id, {
            attributes: include.eventAttrs,
            include: include.all
          })
          .then(e => {
            if(!e) {
              return res.status(404).send({
                message: 'ERROR: Event not found.',
                status: 404
              })
            }
            return res.status(200).send(e)
          })
          .catch(error => res.status(500).send(error));
      })
      .catch((error) => res.status(400).send({
        message: 'Event not found'
      }));
  },
  softDelete(req, res) {
    return Event
      .findOne({
        where: {uuid: req.params.uuid},
        attributes: ['id'],
      })
      .then(event => {
        if (!event) return res.status(200).send({success: true});
        return event
          .update({isDeleted: true},
            {where: {uuid: req.params.uuid}}
          )
          .then(() => {
            return res.status(200).send({success: true})
          })
          .catch((error) => res.status(500).send(error));
      })
      .catch((error) => res.status(500).send({
        error,
        message: 'Internal server error',
      }));
  }
};