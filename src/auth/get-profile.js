// eslint-disable-next-line new-cap
const router = require('@awaitjs/express').Router();
const authenticated = require('../middleware/authenticated-middleware');
const clonedeep = require('lodash.clonedeep');

// eslint-disable-next-line max-len
router.getAsync('/api/auth/profile', [authenticated], async (req, res, next) => {
  const user = clonedeep(req.user);
  delete user.password;
  return res.json(user);
});

module.exports = router;
