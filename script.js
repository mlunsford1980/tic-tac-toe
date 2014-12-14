// Code goes here

function repeat(action, iterations) {
  for (var i = 0; i < iterations; i++) {
    action();
  } 
}

function TurnController(firstPlayer, difficulty) {
  this.currentplayer = firstPlayer;
  var that = this;
  
  this.newTurn = function() {
    this.currentplayer = this.currentplayer === 'x' ? 'circle' : 'x';
    $('#status').text(this.currentplayer + ' is thinking...');
    setTimeout(this.emitTurnEvent, 500, difficulty);
  }
  
  this.emitTurnEvent = function(difficulty) {
    radio('newTurnEvent').broadcast(that.currentplayer, difficulty);
  }
  
  this.initialize = function() {
    $('#player-indicator').text(this.currentplayer === 'x' ? 'X' : 'O');
  }
}

function ComputerPlayer(player, gameBoard) {
  this.player = player;
  this.gameBoard = gameBoard;
  var that = this;
  
  this.newTurnEventHandler = function(player, difficulty) {
    if (player == that.player) {
      var gamePiece = gameBoard.findBestPiece(player, difficulty);
      if (gamePiece === null || gamePiece === undefined) {
        gameBoard.endGame('No more available moves!');
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


