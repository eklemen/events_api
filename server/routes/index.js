const userController = require('../controllers').user;
const eventsController = require('../controllers').event;
const passport = require('passport');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the User API!',
  }));

  // Instagram Auth
  app.get('/auth/instagram', passport.authenticate('instagram'));
  app.get('/auth/instagram/callback',
    passport.authenticate('instagram'),userController.igLoginCallback);

  app.post('/api/events', eventsController.create);
  app.get('/api/events', eventsController.list);
  app.get('/api/events/:uuid', eventsController.getOne);
  app.put('/api/events/:uuid', eventsController.update);
  app.delete('/api/events/:uuid', eventsController.softDelete);

};
