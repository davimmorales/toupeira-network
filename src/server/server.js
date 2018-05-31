const http = require('http');
const app = require('./config/express')();
const config = require('./config/config')();
const logger = require('./app/utils/logger');
require('./config/database')(config.database);

// Initialize the app
http.createServer(app).listen(config.port, config.address, () => {
  logger.success('Toupeira server running on port ' + config.port);
});
