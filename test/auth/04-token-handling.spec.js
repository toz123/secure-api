/* eslint-disable max-len */
const supertest = require('supertest');
const expect = require('expect');
const {User, truncateAll} = require('../../src/database');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../../src/config');

let request;

const register = async function({email, password}) {
  const response = await request.post('/api/auth/register').send({email, password});
  return response.headers.token;
};

const signin = async function({email, password}) {
  const response = await request.post('/api/auth/signin').send({email, password});
  return response.headers.token;
};

describe('JWT token handling for any request', function() {
  let requestUser;

  // For these tests, set up a dummy API route in the application
  // and when it is called, extract the user that might have been
  // set up by the JWT-handling middleware
  before(async function() {
    const app = require('../../src/app')();
    app.get('/api/dummy', (req, res) => {
      requestUser = req.user;
      res.status(200).end();
    });
    request = supertest(app);
  });

  beforeEach(async function() {
    await truncateAll();
    requestUser = undefined;
  });

  it('does nothing if no token supplied', async function() {
    const response = await request.get('/api/dummy');
    expect(response.status).toBe(200);
    expect(requestUser).not.toBeDefined();
  });

  it('ignores JWT token if not provided by Bearer authorization', async function() {
    const response = await request.get('/api/dummy')
        .set('Authorization', 'Something-else xyz');
    expect(response.status).toBe(200);
    expect(requestUser).not.toBeDefined();
  });

  it('ignores JWT token when not specified in two parts', async function() {
    const response = await request.get('/api/dummy')
        .set('Authorization', 'xyz');
    expect(response.status).toBe(200);
    expect(requestUser).not.toBeDefined();
  });

  it('ignores invalid token', async function() {
    const response = await request.get('/api/dummy')
        .set('Authorization', 'Bearer invalid-jwt-token');
    expect(response.status).toBe(200);
    expect(requestUser).not.toBeDefined();
  });

  it('ignores JWT token if user with token\'s user ID cannot be found', async function() {
    await register({email: 'fred@acme.com', password: 'abc123'});
    const token = await signin({email: 'fred@acme.com', password: 'abc123'});
    const user = await User.findByEmail('fred@acme.com');
    await User.deleteById(user.id);
    const response = await request.get('/api/dummy')
        .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(requestUser).not.toBeDefined();
  });

  it('ignores JWT token if no user-id in seemingly valid token', async function() {
    const token = jwt.sign({}, jwtSecret);
    const response = await request.get('/api/dummy')
        .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(requestUser).not.toBeDefined();
  });

  it('Loads user into request object from valid token', async function() {
    await register({email: 'fred@acme.com', password: 'abc123'});
    const token = await signin({email: 'fred@acme.com', password: 'abc123'});
    const response = await request.get('/api/dummy')
        .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(requestUser).toBeDefined();
    expect(requestUser).toMatchObject({email: 'fred@acme.com'});
  });
});
