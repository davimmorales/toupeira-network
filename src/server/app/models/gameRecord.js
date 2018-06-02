const mongoose = require('mongoose');
const schema = mongoose.Schema;

module.exports = () => {
  const gameSchema = schema({
    inProgress: {type: Boolean, default: true},
    currentPlayerId: {type: Number, min: 1, max: 2, default: 1},
    player1: {
      score: {type: Number, min: 0, max: 20, default: 0},
      board: [String],
    },
    player2: {
      score: {type: Number, min: 0, max: 20, default: 0},
      board: [String],
    },
  });
  return mongoose.model('GameRecord', gameSchema);
};
