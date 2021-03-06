const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const expect = require('expect');

let { paul, tony, sarah } = require('./example_user');

const User = mongoose.model('user');

const createUser = (user) =>{
  return User.create(user);
};


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
        console.log(response.body);
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

    it('POST /api/users should throw an error for duplicate email', (done) => {
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

  it('should confirm the input pw is different to the stored pw', (done) => {
    let paul1 = new User(paul);
    paul1.save()
      .then(() => {
        return User.findOne({email: paul.email})
      })
      .then((user) => {
        assert(user.password !== paul.password);
        done();
      })
      .catch(e => done(e));
  });

  it('POST /api/users creates a new user and returns a new jwt', (done) => {
    request(app)
      .post('/api/users')
      .send(sarah)
      .end((err, response) => {
        if(err) {
          return done(err);
        }
        expect(response.headers["x-auth-token"]).toExist();
        expect(response.body.email).toBe(sarah.email);
        expect(response.body.username).toBe(sarah.username);
        done();
      });
  });

  it(' POST /api/user/login should login a user and return a token', (done) => {
    createUser(paul)
    .then(() => {
      request(app)
        .post('/api/user/login')
        .send(paul)
        .end((err, response) => {
          expect(response.headers["x-auth-token"]).toExist();

          User.findOne({email: paul.email})
            .then((user) => {
              assert(user.tokens[0].token === response.headers["x-auth-token"]);
              done();
            }).catch(e => done(e));
        });
    }).catch(e => done(e));
  });

  it('PUT /api/user/update updates the username', (done) => {
    request(app)
      .post('/api/users')
      .send(sarah)
      .expect(200)
      .end((err, response) => {
        let token = response.headers["x-auth-token"];
        request(app)
          .put('/api/user/update')
          .set('x-auth-token', token)
          .send({ "username": "awesomeuserftw"})
          .end((err, response) => {
            expect(response.body.message).toBe('success');
            User.findOne({ email: sarah.email })
              .then(user => {
                expect(user.username).toBe("awesomeuserftw");
                done();
              }).catch(e => done(e));
          });
      });
  });

it('PUT /api/user/update invalid request responds with an error message', (done) => {
    request(app)
      .post('/api/users')
      .send(sarah)
      .expect(200)
      .end((err, response) => {
        let token = response.headers["x-auth-token"];
        request(app)
          .put('/api/user/update')
          .set('x-auth-token', token + "sldibasdkjsb" )
          .send({ "username": "awesomeuserftw"})
          .expect(401)
          .end((err, response) => {
            expect(response.body.message).toBe('invalid credentials');
            done();
          });
      });
  });

it('PUT /api/user/update providing no token responds with an error message', (done) => {
    request(app)
      .post('/api/users')
      .send(sarah)
      .expect(200)
      .end((err, response) => {
        request(app)
          .put('/api/user/update')
          .send({ "username": "awesomeuserftw"})
          .expect(401)
          .end((err, response) => {
            expect(response.body.message).toBe('invalid credentials');
            done();
          });
      });
  });

  it('DELETE /api/user/logout logs the user out', (done) => {
    request(app)
      .post('/api/users')
      .send(tony)
      .end((err, response) => {
        let token = response.headers["x-auth-token"];
        request(app)
          .delete('/api/user/logout')
          .set('x-auth-token', token)
          .end(() => {
            User.findOne({ email: tony.email })
              .then(user => {
                expect(user.tokens.length).toBe(0);
                done();
              }).catch(e => done(e));
          });
      });
  });


  it('DELETE /api/user/delete deletes the user', (done) => {
    request(app)
      .post('/api/users')
      .send(tony)
      .end((err, response) => {
        let token = response.headers["x-auth-token"];
        request(app)
          .delete('/api/user/delete')
          .set('x-auth-token', token)
          .end(() => {
            User.findOne({ email: tony.email })
              .then(user => {
                expect(user).toBe(null);
                done();
              }).catch(e => done(e));
          });
      });
  });


});