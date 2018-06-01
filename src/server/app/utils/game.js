const BOARD_SIZE = 64;
const SHIPS_ON_A_BOARD = 20;
const SQUARE_STATUS = {
  LIVING_SEA: Symbol.for('LIVING_SEA'),
  DEAD_SEA: Symbol.for('DEAD_SEA'),
  LIVING_SHIP: Symbol.for('LIVING_SHIP'),
  DEAD_SHIP: Symbol.for('DEAD_SHIP'),
};
const DEFAULT_SQUARE_STATUS = SQUARE_STATUS.LIVING_SEA;
const SCORE_TO_WIN = 20;

const createBoard = (ships = SHIPS_ON_A_BOARD) => {
  const defaultKey = Symbol.keyFor(DEFAULT_SQUARE_STATUS);
  const livingShipKey = Symbol.keyFor(SQUARE_STATUS.LIVING_SHIP);
  let board = new Array(BOARD_SIZE);
  board.fill(defaultKey);
  while (ships > 0) {
    let randomIndex = getRandomIntInclusive(0, board.length-1);
    if (board[randomIndex] === defaultKey) {
      board[randomIndex] = livingShipKey;
      --ships;
    }
  }
  return board;
};

const updateBoard = (board, square) => {
  let isSquareValid = false;
  let incrementScore = false;
  if (inRangeInclusive(square, 0, board.length-1)) {
    switch (Symbol.for(board[square])) {
      case SQUARE_STATUS.LIVING_SEA:
        board[square] = Symbol.keyFor(SQUARE_STATUS.DEAD_SEA);
        isSquareValid = true;
        break;
      case SQUARE_STATUS.LIVING_SHIP:
        board[square] = Symbol.keyFor(SQUARE_STATUS.DEAD_SHIP);
        isSquareValid = true;
        incrementScore = true;
        break;
      default:
        isSquareValid = false;
        break;
    }
  }
  return {isSquareValid: isSquareValid, incrementScore: incrementScore};
};

const hasScoreToWin = (score) => {
  return score >= SCORE_TO_WIN;
};

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const inRangeInclusive = (value, min, max) => {
    return (value >= min && value <= max) ? true : false;
};

const getNextPlayerId = (playerId) => {
  return (playerId === 1) ? 2 : 1;
};

module.exports = {
  createBoard: createBoard,
  updateBoard: updateBoard,
  hasScoreToWin: hasScoreToWin,
  getNextPlayerId: getNextPlayerId,
};
