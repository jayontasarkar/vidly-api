const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
  process.on('uncaughtException', (error) => {
    console.error(error.message, error);
  });
  process.on('unhandledRejection', (error) => {
    console.error(error.message, error);
  });

  // winston.createLogger({
  //   transports: [new winston.transports.File({ filename: 'logger.log' })],
  // });
  const db = process.env.DB_CONNECTION || 'mongodb://localhost:27017/vidly';
  winston.add(
    new winston.transports.MongoDB({
      db: db,
      options: {
        useUnifiedTopology: true,
      },
    })
  );
};
