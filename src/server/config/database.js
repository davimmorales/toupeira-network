const mongoose = require('mongoose');
const logger = require('../app/utils/logger');

module.exports = (uri) => {
  // Mongoose database
  mongoose.connect(uri);

  // When successfully connected
  mongoose.connection.on('connected', () => {
    logger.success('Mongoose default connection open to ' + uri);
  });

  // If the connection throws an error
  mongoose.connection.on('error', (err) => {
    logger.error('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    logger.warning('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      logger.warning('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
}
