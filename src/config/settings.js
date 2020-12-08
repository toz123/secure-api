const settings = {
  development: {
    jwtSecret: 'ABC123'
  },

  test: {
    jwtSecret: 'ABCDEFGHIJKLM1234567890'
  },

  production: {
    jwtSecret: process.env.JWT_SECRET
  }
};

module.exports = settings;
