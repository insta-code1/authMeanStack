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
  }

};