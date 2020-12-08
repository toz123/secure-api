/* eslint-disable max-len */
const supertest = require('supertest');
const expect = require('expect');
const {truncateAll} = require('../../src/database');

let request;

const register = async function({email, password}) {
  const response = await request.post('/api/auth/register').send({email, password});
  return response.headers.token;
};

const signin = async function({email, password}) {
  const response = await request.post('/api/auth/signin').send({email, password});
  return response.headers.token;
};

describe('GET auth/profile', function() {
  before(async function() {
    const app = require('../../src/app')();
    request = supertest(app);
  });

  beforeEach(async function() {
    await truncateAll();
  });

  it('allows signed in user to read their own details', async function() {
    await register({email: 'fred@acme.com', password: 'abc123'});
    await register({email: 'sam@acme.com', password: 'def456'});
    const token = await signin({email: 'fred@acme.com', password: 'abc123'});
    const response = await request.get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({email: 'fred@acme.com'});
  });

  it('also works with token from registration', async function() {
    await register({email: 'fred@acme.com', password: 'abc123'});
    const token = await register({email: 'sam@acme.com', password: 'def456'});
    const response = await request.get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({email: 'sam@acme.com'});
  });

  it('denies access to anonymous user', async function() {
    const response = await request.get('/api/auth/profile');
    expect(response.status).toBe(401);
  });
});
