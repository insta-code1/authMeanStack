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
        res.send(user);
      }).catch(e => res.send(e));

  }

};