const express = require('express');
const GameRecord = require('./app/models/gameRecord');

const http = require('http');
const app = require('./config/express')();
const config = require('./config/config')();
const logger = require('./app/utils/logger');
require('./config/database')(config.database);

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
http.createServer(app).listen(config.port, config.address, () => {
  logger.success('Toupeira server running on port ' + config.port);
});
