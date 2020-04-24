const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
  const db = process.env.DB_CONNECTION;
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => winston.info('Connected to ' + db))
    .catch((error) => winston.error(error.message, error));
};
