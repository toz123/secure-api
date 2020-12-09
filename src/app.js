const express = require('express');
const helmet = require('helmet');
const {addAsync} = require('@awaitjs/express');
const jwtMiddleware = require('./middleware/jwt-middleware');
const register = require('./auth/register');
const signin = require('./auth/signin');
const getProfile = require('./auth/get-profile');

module.exports = function() {
  const app = addAsync(express());
  app.use(helmet());
  app.use(express.json());

  app.use(jwtMiddleware);

  app.use(register);
  app.use(signin);
  app.use(getProfile);

  /* istanbul ignore next */
  app.get('/hi', (req, res) => {
    res.status(200).send('Hi there Mark, you are using [feature-1]!');
  });

  return app;
};
