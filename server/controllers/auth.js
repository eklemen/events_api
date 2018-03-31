const User = require('../models').User;
const jwt = require('jwt-simple');

const {
  JWT_SECRET,
  TOKEN_EXPIRATION_TIME,
} = require('../config/config.js');

const createToken = (id) => {
  return jwt.encode({
    id,
    expirationDate: new Date(Date.now() + TOKEN_EXPIRATION_TIME),
  }, JWT_SECRET);
};

module.exports = {
  authRoute(req, res, next) {
    // should this function do User.findById(token)
    if(!req.cookies.token) {
      return res.status(403).send({
        success: false,
        message: 'Unauthorized'
      });
    }
    try {
      const decodedToken = jwt.decode(req.cookies.token, JWT_SECRET);
      const userId = decodedToken && decodedToken.id;
      if(decodedToken && userId) {
        User.findById(userId)
          .then(user => {
            if(!user) {
              return res.status(403).send({error: 'Token is invalid'})
            }
            req.tokenBearer = user.dataValues.id;
            next();
          })
          .catch(error => {
            res.status(400).send(error);
          })

      } else {
        return res.status(403).send({
          success: false,
          message: 'Unauthorized'
        });
      }
    } catch (e) {
      return res.status(403).send({
        success: false,
        message: 'Unauthorized. Token is invalid.'
      });
    }
  },

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
};
