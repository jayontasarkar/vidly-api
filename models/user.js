const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
userSchema.methods.generateAuthToken = function () {
  const privateKey = process.env.jWT_PRIVATE_KEY || 'vidly_jwtPrivateKey';
  const token = jwt.sign({ _id: this._id, name: this.name, email: this.email, isAdmin: this.isAdmin }, privateKey);
  return token;
};

const User = mongoose.model('User', userSchema);

function validate(user) {
  const schema = {
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(1024).required(),
  };

  if (user.hasOwnProperty('name'))
    schema.name = Joi.string().min(5).max(100).required();

  if (user.hasOwnProperty('isAdmin')) schema.isAdmin = Joi.boolean();

  const userSchema = Joi.object(schema);

  return userSchema.validate(user);
}

exports.User = User;
exports.validate = validate;
