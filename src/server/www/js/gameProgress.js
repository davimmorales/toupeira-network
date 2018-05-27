(() => {

  const SQUARE_STATUS = {
    LIVING_SEA: {
      SYMBOL: Symbol.for('LIVING_SEA'),
      CLASS: 'bg-primary'
    },
    DEAD_SEA: {
      SYMBOL: Symbol.for('DEAD_SEA'),
      CLASS: 'bg-secondary'
    },
    LIVING_SHIP: {
      SYMBOL: Symbol.for('LIVING_SHIP'),
      CLASS: 'bg-success'
    },
    DEAD_SHIP: {
      SYMBOL: Symbol.for('DEAD_SHIP'),
      CLASS: 'bg-danger'
    }
  };
  const DEFAULT_SQUARE = SQUARE_STATUS.LIVING_SEA;
  const TROPHY = '🏆';
  const TROPHY_HTML = `<span style="color: gold">${TROPHY}</span>`;
  const SCORE_TO_WIN = 20;

  const refreshPage = () => {
    $.ajax({
      url: '/game/progress',
      type: 'GET',
      dataType: 'json',
      success: (jsonData) => {
        updatePlayersBoards(jsonData.progress);
        updatePlayersScores(jsonData.progress);
        displayWinner(jsonData.progress);
      },
      error: () => { console.log('Refresh failed'); }
    });
  }

  const updatePlayersScores = (progress) => {
    updateScore('player1Score', progress.player1.score);
    updateScore('player2Score', progress.player2.score);
  }

  const updateScore = (id, score) => {
    let scoreFormattedString = Number(score).toString().padStart(2, '0');
    document.getElementById(id).innerText = scoreFormattedString;
  }

  const updatePlayersBoards = (progress) => {
    let showShipsOnPlayer1Board = (Number(progress.playerId) === 1) ? true : false;
    let showShipsOnPlayer2Board = (Number(progress.playerId) === 2) ? true : false;
    updateBoard('player1Board', progress.player1.board, showShipsOnPlayer1Board);
    updateBoard('player2Board', progress.player2.board, showShipsOnPlayer2Board);
  }

  const updateBoard = (id, board, showLivingShips) => {
    let boardElement = document.getElementById(id);
    for (let row = 0; row < boardElement.children.length; ++row) {
      let rowElement = boardElement.children[row];
      for (let column = 0; column < rowElement.children.length; ++column) {
        let arrayIndex = matrixToArrayIndex(row, column, boardElement.children.length);
        updateSquare(rowElement.children[column], board[arrayIndex], showLivingShips);
      }
    }
  }

  const matrixToArrayIndex = (row, column, numberOfSquaresInARow) => {
    return (row * numberOfSquaresInARow) + column;
  }

  const updateSquare = (squareElement, square, showLivingShips) => {
    let classList = squareElement.classList;
    if (classList.contains(DEFAULT_SQUARE.CLASS) &&
          square.symbol !== DEFAULT_SQUARE.SYMBOL) {
      classList.remove(DEFAULT_SQUARE.CLASS);
      classList.add(getClassBySymbol(square.symbol, showLivingShips));
    }
  }

  const getClassBySymbol = (symbol, showLivingShips) => {
    switch (symbol) {
      case SQUARE_STATUS.LIVING_SEA.SYMBOL:
        return SQUARE_STATUS.LIVING_SEA.CLASS;
      case SQUARE_STATUS.DEAD_SEA.SYMBOL:
        return SQUARE_STATUS.DEAD_SEA.CLASS;
      case SQUARE_STATUS.LIVING_SHIP.SYMBOL:
        return (showLivingShips) ? SQUARE_STATUS.LIVING_SHIP.CLASS : DEFAULT_SQUARE.CLASS;
      case SQUARE_STATUS.DEAD_SHIP.SYMBOL:
        return SQUARE_STATUS.DEAD_SHIP.CLASS;
      default:
        return DEFAULT_SQUARE.CLASS;
    }
  }

  const displayWinner = (progress) => {
    appendTrophyIfHasScoreToWin('player1Name', progress.player1.score);
    appendTrophyIfHasScoreToWin('player2Name', progress.player2.score);
  }

  const appendTrophyIfHasScoreToWin = (id, score) => {
    if (hasScoreToWin(score)) {
      appendTrophyToName(id);
    }
  }

  const hasScoreToWin = (score) => {
    return Number(score) >= SCORE_TO_WIN;
  }

  const appendTrophyToName = (id) => {
    let name = document.getElementById(id);
    if (!name.innerHTML.includes(TROPHY_HTML)) {
      name.innerHTML = name.innerHTML.concat(' ').concat(TROPHY_HTML);
    }
  }

  $(document).ready(window.setInterval(refreshPage, 1000));
  
})();