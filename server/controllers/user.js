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
  igLogin(accessToken, refreshToken, profile, done) {
    return User.findOne({
      where: {
        igUsername: profile.username,
        igId: profile.id
      }
    })
      .then(user => {
        if(!user) {
          // Create a user
          return User.create({
            igUsername: profile.username,
            igId: profile.id,
            igToken: accessToken,
            businessName: profile.displayName,
            igFullName: profile.displayName,
            provider: profile.provider,
            profilePicture: profile._json.data.profile_picture,
          })
            .then(newUser => {
              // Update the user with a token
              newUser.update({
                token: createToken(newUser.dataValues.id)
              })
                .then(updatedUser => {
                  done(
                    null,
                    {user: updatedUser, newUser: true})
                })
                .catch(error => done(error));
              }
            )
            .catch(error => done(error));
        }
        // Update an existing user
        return user.update({
          token: createToken(user.dataValues.id),
          provider: profile.provider || user.provider,
          igToken: accessToken
        })
          .then(existingUser => done(null, {user: existingUser, newUser: false}))
          .catch(error => done(error));
      })
      .catch(error => done(error));
  },
  igLoginCallback(req, res) {
    if(req.user){
      const {
        uuid, igUsername, igId, igToken, token,
        igFullName, provider, profilePicture,
      } = req.user.user;
      return res.status(200)
        .cookie('token', token)
        .send({
          user: {
            uuid,
            igUsername,
            igId,
            igToken,
            igFullName,
            provider,
            profilePicture,
          },
          newUser: req.user.newUser
      });
    }
    return res.status(500).send({error: 'Internal server error.'})
  },

  logout(req, res) {
    req.logout();
    res.status(200).send({ success: true })
  },

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
  self(req, res) {
    return User
      .findOne({
        where: {igToken: req.cookies.token},
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
      .catch(error => res.status(400).send(error));
  }
};
