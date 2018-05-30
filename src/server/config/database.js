const mongoose = require('mongoose');
const logger = require('../app/utils/logger');
const dbURI = 'mongodb://localhost:27017/toupeira-network';

module.exports = () => {
	// Mongoose database
  mongoose.connect(process.env.MONGODB_URI || dbURI);

  // When successfully connected
  mongoose.connection.on('connected', () => {
    logger.success('Mongoose default connection open to ' + dbURI);
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
