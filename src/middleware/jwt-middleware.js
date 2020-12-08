const {wrap} = require('@awaitjs/express');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config');
const {User} = require('../database');

const middleware = async function(req, res, next) {
  const authorization = req.headers.authorization;
  if (authorization) {
    if (authorization.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1];
      let payload;
      try {
        payload = jwt.verify(token, jwtSecret);
      } catch (error) {
        payload = undefined;
      }
      if (payload) {
        const userId = payload['user-id'];
        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            req.user = user;
          }
        }
      }
    }
  }
  return next();
};

module.exports = wrap(middleware);
