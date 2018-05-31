module.exports = (app) => {
  const {game} = app.controllers;
  app.get('/game/player', game.player);
  app.post('/game/start', game.start);
  app.get('/game/status', game.status);
};
