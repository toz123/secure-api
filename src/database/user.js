const db = require('./db');

const USERS = 'users';

module.exports = {
  findOne: async function(condition) {
    return await db(USERS).where(condition).first();
  },

  findById: async function(id) {
    return await this.findOne({id});
  },

  findByEmail: async function(email) {
    return await this.findOne({email});
  },

  create: async function(user) {
    const ids = await db(USERS).insert(user).returning('id');
    const id = ids[0];
    return await this.findById(id);
  },

  deleteById: async function(id) {
    await db(USERS).where({id}).delete();
  },

  truncate: async function() {
    await db(USERS).truncate();
  }
};
