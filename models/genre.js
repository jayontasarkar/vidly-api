const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
});

const Genre = mongoose.model('Genre', genreSchema);

function validate(data) {
  const genreSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });

  return genreSchema.validate(data);
}

exports.Genre = Genre;
exports.validate = validate;
exports.genreSchema = genreSchema;
