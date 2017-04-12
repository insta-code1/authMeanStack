const User = require('../models/userSchema');

module.exports = {

  verifyToken(req, res, next) {
    const token = req.headers["x-auth-token"];

    User.confirmToken(token)
      .then(user => {
        if(!user) {
          return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
      }).catch(() => res.status(401).send({message: 'invalid credentials'}));
  }

};