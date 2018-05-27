const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  inProgress: Boolean,
  nextPlayerId: { type: Number, min: 1, max: 2 },
  player1: {
    score: { type: Number, min: 0, max: 20 },
    board: [String]
  },
  player2: {
    score: { type: Number, min: 0, max: 20 },
    board: [String]
  }
});

module.exports = mongoose.model('GameRecord', gameSchema);
