const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = () => {
  const gameSchema = mongoose.Schema({
    inProgress: Boolean,
    nextPlayerId: { type: Number, min: 1, max: 2, default: 1 },
    player1: {
      score: { type: Number, min: 0, max: 20, default: 0 },
      board: [String]
    },
    player2: {
      score: { type: Number, min: 0, max: 20, default: 0 },
      board: [String]
    }
  });
  return mongoose.model('GameRecord', gameSchema);
};
