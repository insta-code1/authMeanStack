const assert = require('assert');
const request = require('supertest');

const app = require('../app');

describe('Express', () => {
  it('should respond to GET request', (done)=> {
    request(app)
      .get('/api')
      .end((err, response) => {
        assert(response.body.content === "It works!");
        done();
      });
  });
});