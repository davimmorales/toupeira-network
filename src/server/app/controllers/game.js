module.exports = (app) => {
  var GameRecord = app.models.gameRecord;
  const GameController = {
    player(req, res) {
      let playerId = req.query.player;
      res.render('game');
    },
    start(req, res) {
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
    },
    status(req, res) {
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
    }
  };
  return GameController;
};
