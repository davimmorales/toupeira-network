module.exports = (app) => {
  const {game} = app.controllers;
  app.get('/game/player', game.player);

  app.post('/game/start', game.start);
  app.post('/game/play', game.play);
  app.get('/game/status', game.status);
  app.get('/game/nextPlayer', game.nextPlayer);
  app.get('/game/progress', game.progress);
};
