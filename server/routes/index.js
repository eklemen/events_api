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

  app.get('/auth/instagram', passport.authenticate('instagram'));

  app.get('/auth/instagram/callback',
    passport.authenticate('instagram'),
    function(req, res) {
      if(req.user && req.user.dataValues) {
        const {
          email, ig_username, ig_id,
          fb_username, fb_id, token,
          business_name, provider
        } = req.user;
        return res.status(200).send({
          user: {
            email,
            igUsername: ig_username,
            igId: ig_id,
            fbUsername: fb_username,
            fbId: fb_id,
            token,
            businessName: business_name,
            provider,
          }
        })
      }
      return res.status(500).send({error: 'Internal server error.'})
    });
};
