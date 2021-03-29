const request = require('supertest');
const assert = require('assert');
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
describe('POST /api/v1/users', () => {
  it('responds with a json message "{status: success}"', (done) => {
    request(app)
      .post('/api/v1/users')
      .send({
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        assert.equal(response.body.status, 'success');
        done();
      })
      .catch((err) => done(err));
  });
});
describe('PATCH /api/v1/users/:id', () => {
  it('responds with a json message "{status: success}"', (done) => {
    request(app)
      .patch('/api/v1/users/2')
      .send({
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        assert.equal(response.body.status, 'success');
        done();
      })
      .catch((err) => done(err));
  });
});
