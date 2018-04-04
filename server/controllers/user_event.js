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

      const userEvent = await UserEvent.findOne({
        where: {
          UserRowId: userId,
          EventRowId: dataValues.id,
        },
      });
      if(!userEvent) {
        await UserEvent.create({
          UserRowId: userId,
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
              as: 'attendees',
              attributes: userAttrs,
            },
          ]
        });
        return res.status(200).send({...newEvent.dataValues, newMember: true});
      }
      // else {
      //   const updatedJoin = await UserEvent.update({
      //     ...permissions
      //   },{
      //     where: {
      //       id: userEvent.dataValues.id
      //     },
      //     returning: true,
      //   });
      //   if(updatedJoin) {
      //     const updatedEvent = await Event.findById(dataValues.id, {
      //       attributes: eventAttrs,
      //       include: [
      //         {
      //           model: User,
      //           as: 'creator',
      //           attributes: userAttrs
      //         },
      //         {
      //           model: User,
      //           as: 'attendees',
      //           attributes: userAttrs,
      //         },
      //       ]
      //     });
      //     return res.status(200).send({...updatedEvent, newMember: false});
      //   }
      //   console.log('updatedJoin------------\n\r', updatedJoin);
      // }
      console.log('userEvent------------\n\r', userEvent);
      return res.status(200).send(userEvent.dataValues);
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