const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const Customer = mongoose.model(
  'Customer',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })
);

function validate(data) {
  const customerSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    phone: Joi.string().min(3).max(20).required(),
    isGold: Joi.required(),
  });

  return customerSchema.validate(data);
}

exports.Customer = Customer;
exports.validate = validate;
