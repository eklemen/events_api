const User = require('../models').User;

const jwt = require('jwt-simple');
const passport = require('passport');
const { compose } = require('compose-middleware');

const {
  JWT_TOKEN,
  TOKEN_EXPIRATION_TIME,
} = require('../config/config.js');

// const userAttrs = {
//   email
// };

module.exports = {

  login: compose([
    passport.authenticate('local'),
    (req, res) => {
      const token = jwt.encode({
        id: req.user.id,
        expirationDate: new Date(Date.now() + TOKEN_EXPIRATION_TIME),
      }, JWT_TOKEN);

      res.status(200).send({ token });
    },
  ]),


  create(req, res) {
    const { name, email, password, isAdmin } = req.body;
    return User
      .create({
        name, email, password, isAdmin
      })
      .then(users => res.status(201).send(users))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return User
      .all()
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },
  getOne(req, res) {
    return User
    // should getOne exclude deleted items by default?
      .findOne({
        where: {ig_id: req.user.dataValues.ig_id},
        // attributes: eventAttrs,
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
  }
};
