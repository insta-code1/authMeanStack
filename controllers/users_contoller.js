const User = require('../models/userSchema');
const _ = require('lodash');

module.exports = {

  testResponse(req, res) {
    res.send({ content: "It works!" });
  },

  create(req, res) {
    let userAttr = _.pick(req.body, 
    ["username", "email", "password"]);

    User.create(userAttr)
      .then(user => {
       return user.createAuthToken();
      })
      .then((token) => {
        res.header('x-auth-token', token).send(_.omit(userAttr, ["password"]));
      })
      .catch(e => res.send(e.errors));
  },

  login(req, res) {
    User.confirmPassword(req.body.email, req.body.password)
      .then(user => {
        console.log(user)
        return user.createAuthToken();
      })
      .then((token) => {
        res.header('x-auth-token', token).send({ message: 'success'});
      })
      .catch(e => res.status(401).send({message: 'login details incorrect'}));
  },

  update(req, res) {
    let { username } = req.body;
    let { _id } = req.user;

    User.findByIdAndUpdate({ _id }, { username })
      .then((user) => {
        res.status(200).send({message: 'success'})
      }).catch(() => res.status(401));
  }

};