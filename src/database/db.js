const knex = require('knex');
const knexfile = require('../config/knexfile');

/* istanbul ignore next */
const env = process.env.NODE_ENV || 'development';

const knexConfig = knexfile[env];
const db = knex(knexConfig);

module.exports = db;
