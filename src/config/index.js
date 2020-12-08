const settings = require('./settings');

/* istanbul ignore next */
const env = process.env.NODE_ENV || 'development';

module.exports = settings[env];
