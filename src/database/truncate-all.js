const User = require('./user');

const truncateAll = async function() {
  await User.truncate();
};

module.exports = truncateAll;
