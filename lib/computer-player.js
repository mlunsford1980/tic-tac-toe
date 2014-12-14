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