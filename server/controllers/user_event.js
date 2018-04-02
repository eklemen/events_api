const Sequelize = require('sequelize');
const db = require('../models');
const Op = Sequelize.Op;
const Event = require('../models').Event;
const User = require('../models').User;
const eventAttrs = ['uuid', 'venue', 'eventDate', 'title'];
const userAttrs = [
  'uuid',
  'email',
  'phone',
  'igUsername',
  'igFullName',
  'profilePicture',
  'businessName'];

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
};