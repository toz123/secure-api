// eslint-disable-next-line new-cap
const router = require('@awaitjs/express').Router();
const {body} = require('express-validator');
const validate = require('../middleware/validation-middleware');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config');
const {User} = require('../database');

const rules = [
  body('email').notEmpty(),
  body('password').notEmpty()
];

// eslint-disable-next-line max-len
router.postAsync('/api/auth/signin', rules, validate, async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).end();
  }
  const token = jwt.sign(
      {'user-id': user.id}, jwtSecret, {expiresIn: '20 minutes'});
  res.set('token', token);
  return res.status(200).end();
});

module.exports = router;
