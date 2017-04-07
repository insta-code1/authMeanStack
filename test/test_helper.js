const mongoose = require('mongoose');

before((done) => {
  mongoose.connect('mongodb://localhost/authapp_test')
  mongoose.connection
    .once('open', () => {
      console.log('Connected to test db');
      done();
    })
    .on('error', err => console.log('connection error',err));
});

beforeEach((done) => {
  const {users} = mongoose.connection.collections;
  users.drop()
    .then(() => done())
    .catch(() => done());
});