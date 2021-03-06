function GamePiece(board, target, controller, x, y) {
  var that = this,
      square = $(target);
  this.x = x;
  this.y = y;
  this.adjacentPieces = {
    n: null,
    s: null,
    e: null,
    w: null,
    ne: null,
    se: null,
    sw: null,
    nw: null
  };
  this.square = square;
  
  this.owner = function() {
    if (this.isAvailable()) {
      return false;
    } else {
      return square.hasClass('x') ? 'x' : 'circle';
    }
  }
  
  this.isAvailable = function() {
    return !square.hasClass('x') && !square.hasClass('circle');
  }
  
  this.claimForplayer = function (player) {
    square.addClass(player); 
    $('#player-indicator').text(player === 'x' ? 'O' : 'X');
  }
  
  this.makeMove = function() {
    if (that.isAvailable()) {
      that.claimForplayer(controller.currentplayer);
      if (!board.searchForWin()) {
        controller.newTurn();
      }
    }
  }
  
  this.isAdjacent = function(x, y) {
    var xDistance = Math.abs(x-this.x),
        yDistance = Math.abs(y-this.y);
    return xDistance <= 1 && yDistance <= 1 && (xDistance+yDistance) !== 0;
  } 
  
  this.isNorth = function(y) {
    return that.y - y === 1;
  }
  
  this.isSouth = function(y) {
    return that.y - y === -1;
  }
  
  this.isWest = function(x) {
    return that.x - x === 1;
  }
  
  this.isEast = function(x) {
    return that.x - x === -1;
  }
  
  this.newGamePieceHandler = function(gp) {
    var direction = "";
    if (that.isAdjacent(gp.x, gp.y)) {
      direction = (that.isNorth(gp.y)) ? 'n' : '';
      direction = (that.isSouth(gp.y)) ? 's' : direction;
      direction += (that.isEast(gp.x)) ? 'e' : '';
      direction += (that.isWest(gp.x)) ? 'w' : '';
      that.adjacentPieces[direction] = gp;
    }
  }
  
  radio('newGamePieceEvent').subscribe(that.newGamePieceHandler);
  
  target.one('click', this.makeMove);
}
