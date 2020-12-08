/* eslint-disable max-len */
// eslint-disable-next-line new-cap
const router = require('@awaitjs/express').Router();
const {body} = require('express-validator');
const jwt = require('jsonwebtoken');
const validate = require('../middleware/validation-middleware');
const {jwtSecret} = require('../config');
const {User} = require('../database');

const rules = [
  body('email').trim().toLowerCase().isEmail(),
  body('password').notEmpty(),
  body('email').custom(async function(email, {req}) {
    const user = await User.findByEmail(email);
    if (user) {
      return Promise.reject(new Error(
          'Email address has already been registered'));
    }
  })
];

router.postAsync('/api/auth/register', rules, validate, async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.create({email, password});
  const token = jwt.sign({'user-id': user.id}, jwtSecret, {expiresIn: '20 minutes'});
  res.set('token', token);
  return res.status(200).end();
});

module.exports = router;
