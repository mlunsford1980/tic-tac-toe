// Code goes here

function repeat(action, iterations) {
  for (var i = 0; i < iterations; i++) {
    action();
  } 
}

function TurnController(firstPlayer, difficulty) {
  this.currentUser = firstPlayer;
  var that = this;
  
  this.newTurn = function() {
    this.currentUser = this.currentUser === 'x' ? 'circle' : 'x';
    $('#status').text(this.currentUser + ' is thinking...');
    setTimeout(this.emitTurnEvent, 500, difficulty);
  }
  
  this.emitTurnEvent = function(difficulty) {
    radio('newTurnEvent').broadcast(that.currentUser, difficulty);
  }
  
  this.initialize = function() {
    $('#user-indicator').text(this.currentUser === 'x' ? 'X' : 'O');
  }
}

function ComputerPlayer(player, gameBoard) {
  this.player = player;
  this.gameBoard = gameBoard;
  var that = this;
  
  this.newTurnEventHandler = function(user, difficulty) {
    if (user == that.player) {
      var gamePiece = gameBoard.findBestPiece(user, difficulty);
      if (gamePiece === null || gamePiece === undefined) {
        gameBoard.endGame('No more available pieces!');
      } else {
        gamePiece.square.trigger('click');
      }
    }
  }
  
  radio('newTurnEvent').subscribe(that.newTurnEventHandler);
}

function reset() {
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
    reset();
  });
});


