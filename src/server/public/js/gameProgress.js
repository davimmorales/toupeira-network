(() => {
  const SQUARE_STATUS = {
    LIVING_SEA: {
      SYMBOL: Symbol.for('LIVING_SEA'),
      CLASS: 'bg-primary',
    },
    DEAD_SEA: {
      SYMBOL: Symbol.for('DEAD_SEA'),
      CLASS: 'bg-secondary',
    },
    LIVING_SHIP: {
      SYMBOL: Symbol.for('LIVING_SHIP'),
      CLASS: 'bg-success',
    },
    DEAD_SHIP: {
      SYMBOL: Symbol.for('DEAD_SHIP'),
      CLASS: 'bg-danger',
    },
  };
  const DEFAULT_SQUARE = SQUARE_STATUS.LIVING_SEA;
  const SCORE_TO_WIN = 20;
  const TROPHY = {
    HTML: '🏆',
    CLASS: 'gold',
  };
  const TURN = {
    HTML: '◉',
    CLASS: 'lawngreen',
  };
  const NO_SHOW_CLASS = 'no-show';

  const refreshPage = () => {
    $.ajax({
      url: '/game/progress',
      type: 'GET',
      dataType: 'json',
      success: (jsonData) => {
        if (jsonData.game) {
          updatePlayersBoards(jsonData.game);
          updatePlayersScores(jsonData.game);
          displayPlayersTurn(jsonData.game);
          displayWinner(jsonData.game);
        }
      },
      error: () => {
        console.log('Refresh failed');
      },
    });
  };

  const updatePlayersScores = (game) => {
    updateScore('player1Score', game.player1.score);
    updateScore('player2Score', game.player2.score);
  };

  const updateScore = (id, score) => {
    let scoreFormattedString = Number(score).toString().padStart(2, '0');
    document.getElementById(id).innerText = scoreFormattedString;
  };

  const updatePlayersBoards = (game) => {
    const contextualizedPlayer = Number(getPlayerOfThisPage());
    let showLivingShipsOnPlayer1Board =
      (contextualizedPlayer === 1) ? true : false;
    let showLivingShipsOnPlayer2Board =
      (contextualizedPlayer === 2) ? true : false;
    updateBoard('player1Board', game.player1.board,
      showLivingShipsOnPlayer1Board);
    updateBoard('player2Board', game.player2.board,
      showLivingShipsOnPlayer2Board);
  };

  const getPlayerOfThisPage = () => {
    let params = new URLSearchParams(window.location.search.substring(1));
    return (params.has('player')) ? params.get('player') : null;
  };

  const updateBoard = (id, board, showLivingShips) => {
    let boardElement = document.getElementById(id);
    for (let row = 0; row < boardElement.children.length; ++row) {
      let rowElement = boardElement.children[row];
      for (let column = 0; column < rowElement.children.length; ++column) {
        let arrayIndex =
          matrixToArrayIndex(row, column, boardElement.children.length);
        updateSquare(rowElement.children[column],
          board[arrayIndex], showLivingShips);
      }
    }
  };

  const matrixToArrayIndex = (row, column, numberOfSquaresInARow) => {
    return (row * numberOfSquaresInARow) + column;
  };

  const updateSquare = (squareElement, symbolString, showLivingShips) => {
    let classList = squareElement.classList;
    let symbol = Symbol.for(symbolString);
    removeClass(classList, DEFAULT_SQUARE.CLASS);
    addClass(classList, getClassBySymbol(symbol, showLivingShips));
  };

  const getClassBySymbol = (symbol, showLivingShips) => {
    switch (symbol) {
      case SQUARE_STATUS.LIVING_SEA.SYMBOL:
        return SQUARE_STATUS.LIVING_SEA.CLASS;
      case SQUARE_STATUS.DEAD_SEA.SYMBOL:
        return SQUARE_STATUS.DEAD_SEA.CLASS;
      case SQUARE_STATUS.LIVING_SHIP.SYMBOL:
        return (showLivingShips === true) ?
          SQUARE_STATUS.LIVING_SHIP.CLASS : DEFAULT_SQUARE.CLASS;
      case SQUARE_STATUS.DEAD_SHIP.SYMBOL:
        return SQUARE_STATUS.DEAD_SHIP.CLASS;
      default:
        return DEFAULT_SQUARE.CLASS;
    }
  };

  const displayPlayersTurn = (game) => {
    if (game.inProgress === true) {
      showTurnIfIsPlayersTurn('player1Emoji', game.nextPlayerId, 1);
      showTurnIfIsPlayersTurn('player2Emoji', game.nextPlayerId, 2);
      hideNotNextPlayersTurn(game.nextPlayerId);
    }
  };

  const showTurnIfIsPlayersTurn = (id, next, side) => {
    if (isPlayersTurn(next, side)) {
      showTurn(id);
    }
  };

  const isPlayersTurn = (next, side) => {
    return Number(next) === Number(side);
  };

  const showTurn = (id) => {
    let emojiElement = document.getElementById(id);
    emojiElement.innerHTML = TURN.HTML;
    let classList = emojiElement.classList;
    addClass(classList, TURN.CLASS);
    removeClass(classList, TROPHY.CLASS);
    removeClass(classList, NO_SHOW_CLASS);
  };

  const hideNotNextPlayersTurn = (nextPlayerId) => {
    let id = null;
    switch (nextPlayerId) {
      case 1:
        id = 'player2Emoji';
        break;
      case 2:
        id = 'player1Emoji';
        break;
      default:
        break;
    }
    if (id !== null) {
      addClass(document.getElementById(id).classList, NO_SHOW_CLASS);
    }
  };

  const displayWinner = (game) => {
    if (game.inProgress === false) {
      showTrophyIfHasScoreToWin('player1Emoji', game.player1.score);
      showTrophyIfHasScoreToWin('player2Emoji', game.player2.score);
    }
  };

  const showTrophyIfHasScoreToWin = (id, score) => {
    if (hasScoreToWin(score)) {
      showTrophy(id);
    }
  };

  const hasScoreToWin = (score) => {
    return Number(score) >= SCORE_TO_WIN;
  };

  const showTrophy = (id) => {
    let emojiElement = document.getElementById(id);
    emojiElement.innerHTML = TROPHY.HTML;
    let classList = emojiElement.classList;
    addClass(classList, TROPHY.CLASS);
    removeClass(classList, TURN.CLASS);
    removeClass(classList, NO_SHOW_CLASS);
  };

  const addClass = (classList, className) => {
    if (!classList.contains(className)) {
      classList.add(className);
    }
  };

  const removeClass = (classList, className) => {
    if (classList.contains(className)) {
      classList.remove(className);
    }
  };

  $(document).ready(window.setInterval(refreshPage, 1000));
})();
