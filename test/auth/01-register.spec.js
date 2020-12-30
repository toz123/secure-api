/* eslint-disable max-len */
const supertest = require('supertest');
const expect = require('expect');
const {User, truncateAll} = require('../../src/database');

let request;

describe('auth/register', function() {
  before(function() {
    this.timeout(20000);
    const app = require('../../src/app')();
    request = supertest(app);
  });

  beforeEach(async function() {
    await truncateAll();
  });

  it('allows user to register', async function() {
    const response = await request.post('/api/auth/register')
        .send({email: 'fred@acme.com', password: 'abc123'});
    expect(response.status).toBe(200);
    expect(response.headers).toHaveProperty('token');
  });

  const invalidRegistrations = [
    {registration: {email: '', password: 'abc123'}, reason: 'missing email'},
    {registration: {email: 'fred@acme.com', password: ''}, reason: 'missing password'},
    {registration: {email: 'fred', password: 'abc123'}, reason: 'invalid email format'}
  ];
  invalidRegistrations.forEach((invalidRegistration) => {
    it(`rejects invalid regsitration - ${invalidRegistration.reason}`, async function() {
      const response = await request.post('/api/auth/register')
          .send(invalidRegistration.registration);
      expect(response.status).toBe(400);
    });
  });

  it('rejects invalid regsitration - email already used', async function() {
    await request.post('/api/auth/register')
        .send({email: 'fred@acme.com', password: 'abc123'});
    const response = await request.post('/api/auth/register')
        .send({email: 'fred@acme.com', password: 'abc123'});
    expect(response.status).toBe(400);
  });

  it('returns no token when registration fails', async function() {
    const response = await request.post('/api/auth/register')
        .send(invalidRegistrations[0]);
    expect(response.headers).not.toHaveProperty('token');
  });

  it.skip('stores password as salted hash, not plain text', async function() {
    await request.post('/api/auth/register')
        .send({email: 'fred@acme.com', password: 'abc123'});
    const user = await User.findByEmail('fred@acme.com');
    expect(user.password).not.toEqual('abc123');
  });
});
