const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre.js');
const isValidId = require('../middlewares/isValidId.js');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', [isValidId], async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('Genre was not found with the given ID');
  res.send(genre);
});

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });
  await genre.save();
  res.send(genre);
});

router.put('/:id', [auth, admin, isValidId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  if (!genre)
    return res.status(404).send('Genre was not found with the given ID');

  res.send(genre);
});

router.delete('/:id', [auth, admin, isValidId], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send('Genre was not found with the given ID');
  res.send(genre);
});

module.exports = router;
