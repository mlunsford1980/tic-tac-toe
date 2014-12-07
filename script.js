// Code goes here

function repeat(action, iterations) {
  for (var i = 0; i < iterations; i++) {
    action();
  } 
}

function TurnController() {
  this.currentUser = 'circle';
  
  this.newTurn = function() {
    this.currentUser = this.currentUser === 'x' ? 'circle' : 'x';
    radio('newTurnEvent').broadcast(this.currentUser);
  }
  
  this.initialize = function() {
    $('#user-indicator').text(this.currentUser === 'x' ? 'X' : 'O');
  }
}

function ComputerPlayer(player, gameBoard) {
  this.player = player;
  this.gameBoard = gameBoard;
  var that = this;
  
  this.newTurnEventHandler = function(user) {
    if (user == that.player) {
      var gamePiece = gameBoard.findBestPiece();
      if (gamePiece === null) {
        gameBoard.endGame('No more available pieces!');
      } else {
        gamePiece.square.trigger('click');
      }
    }
  }
  
  radio('newTurnEvent').subscribe(that.newTurnEventHandler);
}

$(document).ready(function() {
  var gameBoard = new GameBoard($('#foo'), 3);
  gameBoard.createBoard($('#foo'), 3);
  var PcPlayer = new ComputerPlayer('x', gameBoard);
   
});