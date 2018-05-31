const bodyParser = require('body-parser');
const express = require('express');

module.exports = () => {
  // Express app
  var app = express();

  // Support parsing of application/json type post data
  app.use(bodyParser.json());
  // Support parsing of application/x-www-form-urlencoded post data
  app.use(bodyParser.urlencoded({ extended: true }));
  // Tell express that public is the root of our public web folder
  app.use(express.static('./public'));

	return app;
};