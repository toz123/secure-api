/* eslint-disable max-len */
const supertest = require('supertest');
const expect = require('expect');
const {truncateAll} = require('../../src/database');

let request;

const registeredEmail = 'fred@acme.com';
const registeredPassword = 'abc123';
const unregisteredEmail = 'sam@acme.com';
const wrongPassword = 'ABC123';

describe('auth/signin', function() {
  before(async function() {
    const app = require('../../src/app')();
    request = supertest(app);
  });

  beforeEach(async function() {
    await truncateAll();
  });

  beforeEach(async function() {
    await request.post('/api/auth/register')
        .send({email: registeredEmail, password: registeredPassword});
  });

  it('allows user to sign in with recognised credentials', async function() {
    const response = await request.post('/api/auth/signin')
        .send({email: registeredEmail, password: registeredPassword});
    expect(response.status).toBe(200);
    expect(response.headers).toHaveProperty('token');
  });

  const invalidSignins = [
    {signin: {email: '', password: 'abc123'}, reason: 'missing email'},
    {signin: {email: 'sam@acme.com', password: ''}, reason: 'missing password'}
  ];
  invalidSignins.forEach((invalidSignin) => {
    it(`rejects invalid signin (400) - ${invalidSignin.reason}`, async function() {
      const response = await request.post('/api/auth/signin')
          .send(invalidSignin.signin);
      expect(response.status).toBe(400);
    });
  });

  const unrecognisedSignins = [
    {signin: {email: unregisteredEmail, password: registeredPassword}, reason: 'unrecognised email'},
    {signin: {email: registeredEmail, password: wrongPassword}, reason: 'wrong password'}
  ];
  unrecognisedSignins.forEach((unrecognisedSignin) => {
    it(`rejects unrecognised credentials (401) - ${unrecognisedSignin.reason}`, async function() {
      const response = await request.post('/api/auth/signin')
          .send(unrecognisedSignin.signin);
      expect(response.status).toBe(401);
    });
  });
});
