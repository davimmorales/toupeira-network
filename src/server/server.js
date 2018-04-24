var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongodb = require('mongodb');

var ARDUINO_COLLECTION = 'arduino';

// Set an instance of express
var app = express();
// Support parsing of application/json type post data
app.use(bodyParser.json());
// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true })); 
// Tell express that www is the root of our public web folder
app.use(express.static(path.join(__dirname, 'www')));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/toupeira-network', (err, client) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log('Database connection ready');

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, () => {
    var port = server.address().port;
    console.log('App now running on port', port);
  });
});

// ARDUINO API ROUTES BELOW

// Generic error handler used by all endpoints.
var handleError = (res, reason, message, code) => {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({'error': message});
}

/*  '/api/send'
 *    GET: saves the send-value in the database
 */
// app.get('/api/send', (req, res) => {
//   db.collection(ARDUINO_COLLECTION).find({}).toArray((err, docs) => {
//     if (err) {
//       handleError(res, err.message, 'Failed to save arduino send-value.');
//     } else {
//       res.status(200).json(docs);
//     }
//   });
// });

/*  '/api/receive'
 *    GET: retrieves the receive-value saved in the database
 *    POST: saves the receive-value in the database
 */
// app.get('/api/receive', (req, res) => {
//   db.collection(ARDUINO_COLLECTION).find({}).toArray((err, docs) => {
//     if (err) {
//       handleError(res, err.message, 'Failed to retrieve arduino receive-value.');
//     } else {
//       res.status(200).json(docs);
//     }
//   });
// });

app.post('/api/receive', (req, res) => {
  console.log('Nova Requisicao POST!');
  var receiveValue = Number(req.body.receiveValue);
  if (inRange(receiveValue, 0, 255)) {
    db.collection(ARDUINO_COLLECTION).insert(createPair("receiveValue", receiveValue), (err, doc) => {
      if (err) {
        handleError(res, err.message, 'Failed to save arduino receive-value.');
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  } else {
    handleError(res, 'Invalid input', 'Must provide a value.', 400);
  }

  
});

var createPair = (name, value) => {
  return {"key": name, "value": value};
}

var inRange = (value, minValue, maxValue) => {
  return (value >= minValue && value <= maxValue) ? true : false;
}