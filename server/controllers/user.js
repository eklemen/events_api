const User = require('../models').User;

module.exports = {
  list(_req, res) {
    return User
      .findAll({
        where: {isDeleted: false},
        attributes: [
          'uuid',
          'email',
          'igUsername',
          'igFullName',
          'profilePicture',
          'businessName',
        ]
      })
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },
  self: async (req, res) => {
    try {
      const user = await User
        .findById(req.tokenBearer, {
          attributes: [
            'uuid',
            'email',
            'igUsername',
            'igFullName',
            'profilePicture',
            'businessName',
          ],
        });
        if(!user) return res.status(403).send({error: 'Unauthorized'});
        return res.status(200).send(user)
    } catch (err) {
      return res.status(500).send(error)
    }
  },
  getOne(req, res) {
    return User
    // should getOne exclude deleted items by default?
      .findOne({
        where: {uuid: req.params.uuid},
        attributes: [
          'uuid',
          'email',
          'igUsername',
          'igFullName',
          'profilePicture',
          'businessName',
        ]
      })
      .then(user => {
        if(!user) {
          return res.status(404).send({
            message: 'ERROR: User not found.',
            status: 404
          })
        }
        return res.status(200).send(user)
      })
      .catch(error => res.status(500).send(error));
  },
};
