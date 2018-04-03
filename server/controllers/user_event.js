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
  // joinEvent: async (req, res) => {
  //   try {
  //     const {params:{uuid}, tokenBearer: userId} = req;
  //     const event = await Event.findOne({
  //       where: {uuid},
  //       attributes: [...eventAttrs, 'id']
  //     });
  //     const u = await event.getAttendee({attributes: ['id']});
  //     event.getAttendee().then(a => {
  //       console.log('a================\n\r', a);
  //     })
  //       .catch(e => {console.log(e);})
  //     console.log('event------------\n\r', u);
  //     return res.status(200).send(event)
  //   } catch (err) {
  //     return res.status(500).send(err);
  //   }
  // },
  joinEvent(req, res) {
    const {params:{uuid}, tokenBearer: userId} = req;
    Event.findOne({
      where: {uuid},
      attributes: [...eventAttrs, 'id'],
      include: [
        {
          model: User,
          as: 'creator',
        },
        {
          model: UserEvent,
          as: 'attendees',
          attributes: userAttrs
        }
      ]
    })
      .then(event => {
        event.getAttendee().then(a => {
          console.log('a================\n\r', a);
          return res.status(200).send(event)
        })
          .catch(e => {
            console.log(e);
            return res.status(400).send(e)
          });
        console.log('event------------\n\r', u);
    })
      .catch(e => res.status(500).send(e));

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