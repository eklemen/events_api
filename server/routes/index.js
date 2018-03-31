const passport = require('passport');
const userController = require('../controllers').user;
const eventsController = require('../controllers').event;
const authController = require('../controllers').auth;

module.exports = (app) => {

  app.route('/api').get(authController.authRoute, (req, res) => {
    return res.status(200).send({
      message: 'Welcome to the User API!',
    })
  });

  // Instagram Auth
  app.get('/auth/instagram', passport.authenticate('instagram'));
  app.get('/auth/instagram/callback',
    passport.authenticate('instagram'),authController.igLoginCallback);

  app.get('/auth/logout', userController.logout);
  // Users
  app.get('/api/users', userController.list);
  app.get('/api/users/self', userController.self);
  app.get('/api/users/:uuid', userController.getOne);

  app.post('/api/events', eventsController.create);
  app.get('/api/events', eventsController.list);
  app.get('/api/events/:uuid', eventsController.getOne);
  app.put('/api/events/:uuid', eventsController.update);
  app.delete('/api/events/:uuid', eventsController.softDelete);
  // https://api.instagram.com/oauth/access_token
};
