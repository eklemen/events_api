const userController = require('../controllers').user;
const eventsController = require('../controllers').event;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the User API!',
  }));

  app.post('/api/user', userController.create);
  app.get('/api/user', userController.list);
  app.post('/api/user/login', userController.login);

  app.post('/api/events', eventsController.create);
  app.get('/api/events', eventsController.list);
};
