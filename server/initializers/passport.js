'use strict';

const passport = require('passport');
const jwt = require('jwt-simple');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;

const userController = require('../controllers').user;
const User = require('../models').User;

const { JWT_TOKEN } = require('../config/config');
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(new InstagramStrategy({
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/instagram/callback`
  }, userController.igLogin
));


passport.use(new LocalStrategy({
  session: false,
  usernameField: 'email',
  passwordField: 'password',
 }, (email, password, done) => {
  User.findOne( {where: { email } })
    .then((user) => {
      if (!user) { return done(null, false); }
      return Promise.all([user, user.isValidPassword(password)]);
    })
    .then(([user, isValid]) => {
      if (!isValid) { return done(null, false); }
      return done(null, user);
    })
    .catch(done);
}));



passport.use(new BearerStrategy({ session: false }, (token, done) => {
  const decodedToken = jwt.decode(token, JWT_TOKEN);
  const userId = decodedToken && decodedToken.id;
  const expires = decodedToken && new Date(decodedToken.expirationDate);

  if (expires > Date.now()) {
    return User.findById(userId)
      .then(user => done(null, user))
      .catch(done);
  }
  return done(null, false);
}));

// passport.serializeUser((user, done) => done(null, user.id));
//
// passport.deserializeUser((id, done) => {
//   User.findById(id)
//     .then(user => done(null, user))
//     .catch(done);
// });

module.exports = { JWT_TOKEN };
