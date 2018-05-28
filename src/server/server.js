const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('./app/database/mongoose'); // Listeners of mongoose
const serverUtils = require('./app/utils/serverUtils');
const GameRecord = require('./app/models/gameRecord');

// Express app
const app = express();
// Support parsing of application/json type post data
app.use(bodyParser.json());
// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true })); 
// Tell express that www is the root of our public web folder
app.use(express.static(path.join(__dirname, 'www')));

// API Routes
const router = express.Router();
// Prefixed with /api
app.use('/game', router);

router.get('/status', (req, res) => {
  const query = GameRecord.find({});
  query.findOne().sort({ field: 'asc', _id: -1 });
  query.select('inProgress');
  query.exec((err, status) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json(status);
    }
  });
});

router.post('/start', (req, res) => {
  const start = req.body.startGame;
  GameRecord.find({}, (err, game) => {
    if (game.length > 0) {
      res.status(200).json({message: 'Jogo em andamento!'});
    } else {
      let gameRecord = new GameRecord();
      gameRecord.inProgress = start;
      gameRecord.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.status(201).json({message: 'Jogo iniciado!'});
        }
      });
    }
  });
});

// Initialize the app
const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log('Toupeira\'s server running on port', port);
});
