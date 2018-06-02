const http = require('http');
const app = require('./config/express')();
const config = require('./config/config')();
const logger = require('./app/utils/logger');
require('./config/database')(config.MONGODB_URI);

// Initialize the app
http.createServer(app).listen(config.PORT, config.ADDRESS, () => {
  logger.success('Toupeira server running on port ' + config.PORT);
});
