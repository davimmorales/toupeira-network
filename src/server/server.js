const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Registro = require('./app/models/registro');

// Set an instance of express
const app = express();
// Support parsing of application/json type post data
app.use(bodyParser.json());
// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true })); 
// Tell express that www is the root of our public web folder
app.use(express.static(path.join(__dirname, 'www')));

/******************************************************************************/
/********************************** MONGOOSE **********************************/
/******************************************************************************/
// Bring Mongoose into the app
const mongoose = require('mongoose');

// Build the connection string
const dbURI = 'mongodb://localhost:27017/toupeira-network';

// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
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

/******************************************************************************/
/************************** ROTAS PARA API DO ARDUINO *************************/
/******************************************************************************/
const router = express.Router();    // Cria uma instância do express Router

// REGISTRO DAS ROTAS
// Todas as rotas existentes são prefixadas com /api
app.use('/api', router);

router.get('/receive', (req, res) => {
  res.json({message: 'Hello World'});
});

router.post('/receive', (req, res) => {
  console.log('Nova Requisicao POST!');
  const receiveValue = Number(req.body.receiveValue);
  if (inRange(receiveValue, 0, 255)) {
    let registro = new Registro();
    registro.valor = receiveValue;

    registro.save((err) => {
      if (err)
      res.send(err);

      res.status(201).json({message: 'Registro criado!'});
    });
  } else {
    handleError(res, 'Invalid input', 'Must provide a value.', 400);
  }
});

/******************************************************************************/
/************************* FUNÇÕES UTILITÁRIAS E MAIN *************************/
/******************************************************************************/

const createPair = (name, value) => {
  return {"key": name, "value": value};
}

const inRange = (value, minValue, maxValue) => {
  return (value >= minValue && value <= maxValue) ? true : false;
}

// Generic error handler used by all endpoints.
const handleError = (res, reason, message, code) => {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({'error': message});
}

// Initialize the app.
const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log('Toupeira\'s server running on port', port);
});
