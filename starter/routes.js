const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const index = require('../routes/index');
const location = require('../routes/location');
const payments = require('../routes/payments');
const login = require('../routes/login');
const register = require('../routes/register');
const thankyou = require('../routes/thankyou');
const cookieParser = require('cookie-parser');


module.exports = function(app) {
  app.use(cookieParser());
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/', index);
  app.use('/location', location);
  app.use('/payment', payments);
  app.use('/login', login);
  app.use('/register', register);
  app.use('/thankyou', thankyou);

};
