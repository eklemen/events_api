const {User} = require('../models');
const eventAttrs = ['uuid', 'venue', 'eventDate', 'title', 'creator_id'];
const userAttrs = ['uuid', 'email', 'phone', 'igUsername', 'igFullName', 'profilePicture', 'businessName'];

const includeBlocks = {
  inclCreator: {
    model: User,
    as: 'creator',
    attributes: userAttrs
  },
  inclMembers: {
    model: User,
    as: 'members',
    attributes: userAttrs,
    through: {
      attributes: ['userRole', 'userPermission'],
      as: 'memberDetails'
    }
  },
};
includeBlocks.all = [
  includeBlocks.inclCreator,
  includeBlocks.inclMembers,
];
includeBlocks.eventAttrs = eventAttrs;
includeBlocks.userAttrs = userAttrs;

module.exports = includeBlocks;
