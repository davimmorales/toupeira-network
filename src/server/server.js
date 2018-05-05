const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Record = require('./app/models/record');

// Express app
const app = express();
// Support parsing of application/json type post data
app.use(bodyParser.json());
// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true })); 
// Tell express that www is the root of our public web folder
app.use(express.static(path.join(__dirname, 'www')));

const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/toupeira-network';

// Mongoose database
mongoose.connect(process.env.MONGODB_URI || dbURI);
// When successfully connected
mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to ' + dbURI);
});
// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log('Mongoose default connection error: ' + err);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {  
  mongoose.connection.close(() => { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  });
});

// API Routes
const router = express.Router();
// Prefixed with /api
app.use('/api', router);

/**
 * Returns last record inserted in the database
 */
router.get('/receive', (req, res) => {
  const query = Record.find({});
  query.findOne().sort({ field: 'asc', _id: -1 });
  query.select('value');
  query.exec((err, record) => {
    if (err) {
      res.send(err);
    }
    res.json(record);
  });
});

/**
 * Inserts a new record in the database
 */
router.post('/receive', (req, res) => {
  const receiveValue = Number(req.body.receiveValue);
  if (inRange(receiveValue, 0, 255)) {
    let record = new Record();
    record.value = receiveValue;

    record.save((err) => {
      if (err) {
        res.send(err);
      }
      res.status(201).json({message: 'New record created!'});
    });
  } else {
    handleError(res, 'Invalid input', 'Must provide a value.', 400);
  }
});

const inRange = (value, minValue, maxValue) => {
  return (value >= minValue && value <= maxValue) ? true : false;
}

// Generic error handler used by all endpoints.
const handleError = (res, reason, message, code) => {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({'error': message});
}

// Initialize the app
const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log('Toupeira\'s server running on port', port);
});
