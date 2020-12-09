require('dotenv').config();
const winston = require('winston');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

require('./startup/logging')();
require('./startup/db')();
// load routes
require('./startup/routes')(app);
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.APP_PORT || 5000;
const server = app.listen(port, () =>
  winston.info(`Server started on port ${port}`)
);

module.exports = server;
