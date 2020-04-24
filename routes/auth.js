const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user.js');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const { error } = validate(_.pick(req.body, ['email', 'password']));
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = user.generateAuthToken();

  return res
    .header('x-auth-token', token)
    .send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
