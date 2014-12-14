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