const passport = require('passport');
const userController = require('../controllers').user;
const eventsController = require('../controllers').event;
const authController = require('../controllers').auth;
const EventUserController = require('../controllers').EventUser;

module.exports = (app) => {

  app.get('/api', (req, res) => {
      return res.status(200).send({
        message: 'Welcome to the User API!',
      })
  });

  // Instagram Auth
  app.get('/auth/instagram', passport.authenticate('instagram'));
  app.get('/auth/instagram/callback',
    passport.authenticate('instagram'),authController.igLoginCallback);
  app.get('/auth/logout', authController.logout);

  /**
   * Auth required routes
   * */
  app.use(authController.authRoute);

  // Users
  app.get('/api/users', userController.list);
  app.get('/api/users/self', userController.self);
  app.get('/api/users/:uuid', userController.getOne);

  // Event
  app.post('/api/events', eventsController.create);
  app.get('/api/events', eventsController.list);
  app.get('/api/events/:uuid', eventsController.getOne);
  app.put('/api/events/:uuid', eventsController.update);
  app.delete('/api/events/:uuid', eventsController.softDelete);

  // EventUser Actions
  app.post('/api/events/:uuid/join', EventUserController.joinEvent)
  app.post('/api/events/:uuid/leave', EventUserController.leaveEvent)
};
