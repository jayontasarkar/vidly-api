const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer.js');
const isValidId = require('../middlewares/isValidId.js');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  res.send(customers);
});

router.get('/:id', [isValidId], async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send('Customer not found with the given ID');
  res.send(customer);
});

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold ? req.body.isGold : false,
  });
  await customer.save();
  res.send(customer);
});

router.put('/:id', [auth, isValidId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!customer)
    return res.status(400).send('Customer not found with the given ID');
  res.send(customer);
});

router.delete('/:id', [auth, admin, isValidId], async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer)
    return res.status(400).send('Customer not found with the given ID');
  res.send(customer);
});

module.exports = router;
