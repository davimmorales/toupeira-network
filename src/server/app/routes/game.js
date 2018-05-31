module.exports = (app) => {
  const {game} = app.controllers;
  app.post('/game/start', game.start);
  app.get('/game/status', game.status);
};
