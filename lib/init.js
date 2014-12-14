function init() {
  $('#game-board').html('');
  var size = $('#board-size').val(),
      firstPlayer = $('#first-player').val(),
      difficulty = $('#difficulty')[0].checked ? 'hard' : 'easy',
      controller = new TurnController(firstPlayer, difficulty),
      player1Ai = $('#player1-ai')[0].checked,
      player2Ai = $('#player2-ai')[0].checked,
      gameBoard = new GameBoard($('#game-board'), size, controller);
      
  gameBoard.createBoard($('#game-board'), size);
  
  if (player1Ai) {
    var PcPlayer1 = new ComputerPlayer(firstPlayer, gameBoard);
  }
  if (player2Ai) {
    var PcPlayer2 = new ComputerPlayer((firstPlayer === 'x') ? 'circle' : 'x', gameBoard);
  }
  
  radio('newTurnEvent').broadcast(firstPlayer, difficulty);
}

$(document).ready(function() {
  $('#start-game').on('click', function() {
    $('#game-settings-modal').hide();
    $('.blanket').hide();
    init();
  });
});


