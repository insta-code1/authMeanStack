const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const User = mongoose.model('user');
/*
  username: 'funkyusers',
  email: 'funkyuser1@test.com',
  password: '123xyz',
  _id: '58e7b76b82e2eb38f0c61d8f'
  */

describe('Users controller', () => {
  it('POST /api/users create a new user', (done) => {
    request(app)
      .post('/api/users')
      .send({
        "email": "funkyuser1@test.com",
        "username": "funkyusers",
        "password": "123xyz"
      })
      .end((err, response) => {
        assert(response.body.email === "funkyuser1@test.com");
        assert(response.body.username === "funkyusers");
        done();
      });
  });


  it('POST /api/users should throw an error for duplicate username', (done) => {
    request(app)
      .post('/api/users')
      .send({
        "email": "happyuser1@test.com",
        "username": "happyusers",
        "password": "123xyz"
      })
      .end(() => {
        request(app)
          .post('/api/users')
          .send({
            "email": "happyuser2@test.com",
            "username": "happyusers",
            "password": "123xyz"
          })
          .end((err, response) => {
            assert(response.body.username.message === "Error, expected `username` to be unique. Value: `happyusers`");
            done();
          });
      });
  });

    it('POST /api/users should throw an error for duplicate username', (done) => {
    request(app)
      .post('/api/users')
      .send({
        "email": "happyuser20@test.com",
        "username": "happyusersftw",
        "password": "123xyz"
      })
      .end(() => {
        request(app)
          .post('/api/users')
          .send({
            "email": "happyuser20@test.com",
            "username": "happyusers656516",
            "password": "123xyz"
          })
          .end((err, response) => {
            assert(response.body.email.message === 'Error, expected `email` to be unique. Value: `happyuser20@test.com`');
            done();
          });
      });
  });

});