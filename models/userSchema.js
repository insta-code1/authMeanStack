const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    trim: true,
    minlength: 3,
    unique: true
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{value} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.plugin(uniqueValidator);
jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: '1h' });

userSchema.methods.createAuthToken = function () {
  let user = this;
  let access = 'authToken';
  let token = jwt.sign({
    _id: user._id,
    access
  },
    process.enc.JWT_SECRET,
    { expiresIn: '24h' }
  );

  user.tokens.push(token);

  return user.save().then(() => {
    return token;
  });
};

userSchema.pre('save', function (next) {
  let user = this;
  if (user.isModified('password')) {

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    })
  } else {
    next();
  }
});


userSchema.methods.confirmUser = function () {
  let user = this;
  let userObj = user.toObject();

  return _.pick(userObj, ["username", "email", "_id"]);
};



const User = mongoose.model('user', userSchema);

module.exports = User;