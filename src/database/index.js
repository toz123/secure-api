const db = require('./db');
const User = require('./user');
const truncateAll = require('./truncate-all');

module.exports = {
  default: db,
  truncateAll,
  User
};
