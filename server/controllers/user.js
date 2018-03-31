const User = require('../models').User;
const jwt = require('jwt-simple');
const passport = require('passport');
const { compose } = require('compose-middleware');

const {
  JWT_TOKEN,
  TOKEN_EXPIRATION_TIME,
} = require('../config/config.js');

const createToken = (id) => {
  return jwt.encode({
    id,
    expirationDate: new Date(Date.now() + TOKEN_EXPIRATION_TIME),
  }, JWT_TOKEN);
};

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
  self(req, res) {
    return User
      .findById(req.tokenBearer, {
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
        if(!user) return res.status(404).send({error: 'Not found'});
        return res.status(200).send(user)
      })
      .catch(error => res.status(500).send(error));
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
