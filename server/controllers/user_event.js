const {UserEvent, Event, User} = require('../models');
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
  joinEvent: async (req, res) => {
    try {
      const {
        params:{uuid},
        tokenBearer: userId,
        body: {userRole, userPermission},
      } = req;
      const permissions = {
        userRole,
        userPermission,
      };
      // Get the `id` of the Event
      const event = await Event.findOne({
        where: {uuid},
        attributes: [...eventAttrs, 'id'],
      });
      const {dataValues} = event;

      if(!dataValues || !dataValues.id) {
        return res.status(400).send({
          message: 'Event does not exist'
        });
      }
      // Check the join table for that UserEvent relation
      const userEvent = await UserEvent.findOne({
        where: {
          UserRowId: userId,
          EventRowId: dataValues.id,
        },
      });

      // User is not a member, create the record
      if(!userEvent) {
        await UserEvent.create({
          User_rowId: userId,
          Event_rowId: dataValues.id,
          ...permissions,
        });
        const newEvent = await Event.findById(dataValues.id, {
          attributes: eventAttrs,
          include: [
            {
              model: User,
              as: 'creator',
              attributes: userAttrs
            },
            {
              model: User,
              as: 'members',
              attributes: userAttrs,
              through: {
                attributes: ['userRole', 'userPermission'],
                as: 'memberDetails'
              }
            },
          ]
        });
        return res.status(200).send({...newEvent.dataValues, newMember: true});
      }
      // Update user if found
      const updatedJoin = await UserEvent.update({
        ...permissions
      },{
        where: {
          id: userEvent.dataValues.id
        },
        returning: true,
      });
      if(updatedJoin) {
        const updatedEvent = await Event.findById(dataValues.id, {
          attributes: eventAttrs,
          include: [
            {
              model: User,
              as: 'creator',
              attributes: userAttrs
            },
            {
              model: User,
              as: 'members',
              attributes: userAttrs,
              through: {
                attributes: ['userRole', 'userPermission'],
                as: 'memberDetails'
              }
            },
          ]
        });
        return res.status(200).send({...updatedEvent, newMember: false});
      }
    } catch (err) {
      return res.status(500).send(err);
    }
  },
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