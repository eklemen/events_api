const userController = require('../controllers').user;
const eventsController = require('../controllers').event;
const passport = require('passport');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the User API!',
  }));

  app.post('/api/user', userController.create);
  app.get('/api/user', userController.list);
  app.post('/api/user/login', userController.login);

  app.post('/api/events', eventsController.create);
  app.get('/api/events', eventsController.list);
  app.get('/api/events/:uuid', eventsController.getOne);
  app.put('/api/events/:uuid', eventsController.update);
  app.delete('/api/events/:uuid', eventsController.softDelete);

  app.get('/auth/instagram',
    passport.authenticate('instagram'),
    (req, res) => {});

// GET /auth/instagram/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
  app.get('/auth/instagram/callback',
    passport.authenticate('instagram'),
    function(req, res) {
      return res.status(444).send({err: 'nogo'})
    });
};
