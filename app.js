const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./server/initializers/passport');
require('./server/config/config.js');

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

// Require our routes into the application.
require('./server/routes')(app);

// TODO: add error handling middleware
// if (app.get('env') === 'development') {
//
//   app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.render('error', {
//       message: error.message,
//       error
//     });
//   });
//
// }
//
// // production error handler
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

module.exports = app;
