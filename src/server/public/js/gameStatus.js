(() => {
  const startGame = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    $.ajax({
      url: '/game/start',
      type: 'POST',
      data: {startGame: true},
      success: () => {
        enableSelectPlayerArea(true);
      },
      error: () => {
        console.log('Start game failed');
      },
    });
  };

  const restartGame = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    $.ajax({
      url: '/game/restart',
      type: 'POST',
      data: {restartGame: true},
      success: () => {
        enableSelectPlayerArea(true);
      },
      error: () => {
        console.log('Restart game failed');
      },
    });
  };

  const refreshPage = () => {
    $.ajax({
      url: '/game/status',
      type: 'GET',
      dataType: 'json',
      success: (jsonData) => {
        enableSelectPlayerArea(jsonData ? jsonData.inProgress : false);
      },
      error: () => {
        console.log('Refresh failed');
      },
    });
  };

  const enableSelectPlayerArea = (inProgress) => {
    if (inProgress === true) {
      document.getElementById('startGame').setAttribute('class', 'no-show');
      document.getElementById('selectPlayer').setAttribute('class', '');
    } else {
      document.getElementById('startGame').setAttribute('class', '');
      document.getElementById('selectPlayer').setAttribute('class', 'no-show');
    }
  };

  $(document).ready($('#startGameButton').click(startGame));
  $(document).ready($('#restartGameButton').click(restartGame));
  $(document).ready(window.setInterval(refreshPage, 1000));
})();
