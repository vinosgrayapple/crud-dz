const request = require('supertest');

const app = require('../src/app');

describe('GET /api/v1/users', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
