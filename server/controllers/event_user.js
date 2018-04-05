const {EventUser, Event} = require('../models');
const include = require('./constants');

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
        attributes: [...include.eventAttrs, 'id'],
      });
      const {dataValues} = event;

      if(!dataValues || !dataValues.id) {
        return res.status(400).send({
          message: 'Event does not exist'
        });
      }
      // Check the join table for that EventUser relation
      const eventUser = await EventUser.findOne({
        where: {
          UserRowId: userId,
          EventRowId: dataValues.id,
        },
      });

      // User is not a member, create the record
      if(!eventUser) {
        await EventUser.create({
          User_rowId: userId,
          Event_rowId: dataValues.id,
          ...permissions,
        });
        const newEvent = await Event.findById(dataValues.id, {
          attributes: include.eventAttrs,
          include: include.all
        });
        return res.status(200).send({...newEvent.dataValues, newMember: true});
      }
      // Update user if found
      const updatedJoin = await EventUser.update({
        ...permissions
      },{
        where: {
          id: eventUser.dataValues.id
        },
        returning: true,
      });
      if(updatedJoin) {
        const updatedEvent = await Event.findById(dataValues.id, {
          attributes: include.eventAttrs,
          include: include.all
        });
        return res.status(200).send({...updatedEvent, newMember: false});
      }
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  leaveEvent: async (req, res) => {
    const {tokenBearer: userId, params: {uuid}} = req;
    try {
      const {dataValues:{id}} = await Event.findOne({
        where: {uuid},
        attributes: include.eventAttrs
      });
      console.log('id------------\n\r', id);
      await EventUser.destroy({
        where: {
          User_rowId: userId,
          EventRowId: id,
        }
      });
      return res.status(200).send({success: true});
    } catch (err) {
      return res.status(500).send(err);
    }
  },
};