const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user.js');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.post('/', async (req, res) => {
  const { error } = validate(
    _.pick(req.body, ['name', 'email', 'password', 'isAdmin'])
  );
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
});

router.get('/me', [auth], async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -__v');
  res.send(user);
});

module.exports = router;
