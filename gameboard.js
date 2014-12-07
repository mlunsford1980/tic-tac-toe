

function GameBoard(parent,size) {
  var counter = 0;
  var controller = new TurnController(); 
  var that = this;
  controller.initialize();
  
  this.board = [[],[],[]];
  this.x = 0; 
  this.y = 0;
  
  this.endRowIfNeeded = function(square) {
    var newRow = counter % size === 0;
    
    if (newRow) {
      square.addClass('breaker');
    }
  }
  
  this.createSquare = function() {
    var square = $('<div>');
    square.attr('id', that.x + '-' + that.y)
    square.addClass('square');
    that.endRowIfNeeded(square); 
    counter++;
    parent.append(square);
    gamePiece = new GamePiece(that, square, controller, that.x, that.y);
    that.board[that.x][that.y] = gamePiece;
    that.x += 1; 
  }
  
  this.createBoard = function() {
    var createRow = function() {
      that.x = 0;
      repeat(that.createSquare, size);
      that.y += 1;
    }
    repeat(createRow, size);
    for (var x = 0; x < size; x++) {
      for (var y = 0; y < size; y++) {
        radio('newGamePieceEvent').broadcast(that.board[x][y]);
      }
    }
  }
  
  this.searchForWin = function() {
    var gamePiece = null;
    for (var i = 0; i < size; i++) {
      gamePiece = that.board[0][i];
    that.searchForWinInDirection(gamePiece, 'e');
      
      gamePiece = that.board[i][0];
    that.searchForWinInDirection(gamePiece, 's');
    }
      
    gamePiece = that.board[0][0];
    that.searchForWinInDirection(gamePiece, 'se');
    
    gamePiece = that.board[0][size-1];
    that.searchForWinInDirection(gamePiece, 'ne');
  }
  
  this.searchForWinInDirection = function(gamePiece, direction) {
    if (gamePiece.owner() && that.searchInDirection(gamePiece.owner(), gamePiece, direction)) {
        that.endGame(gamePiece.owner() + ' wins!');
        that.displayWinInDirection(gamePiece, direction);
    }
  }
  
  this.searchInDirection = function(user, start, direction) {
    var startOwner = start.owner();
    if (startOwner !== user) {
      return false;
    }
    
    if (startOwner === user && start.adjacentPieces[direction] === null) {
      return true;
    } else {
      return that.searchInDirection(startOwner, start.adjacentPieces[direction], direction);
    }
  }
  
  this.endGame = function(message) {
    var gamePiece;
    $('#result').text(message); 
    
    // Remove event handlers from all pieces
    for (var x = 0; x < size; x++) {
      for (var y = 0; y < size; y++) {
        $('#' + x + '-' + y).off();
      }
    }
  }
  
  this.displayWinInDirection = function(start, direction) {
    while (start !== null) {
      $('#' + start.x + '-' + start.y).addClass('winner');
      start = start.adjacentPieces[direction];
    }
  }
  
  this.findBestPiece = function() {
    var availPieces = that.findAvailablePieces(),
        numPieces = availPieces.length,
        bestPiece = null,
        gamePiece = null;
    
    var x, y;
    for (var i = 0; i < numPieces; i++) {
      gamePiece = availPieces[i];
      x = gamePiece.x;
      y = gamePiece.y;
      
      if (size % 2 == 1 && x === y && x === Math.floor(size/2)) {
        bestPiece = gamePiece;
      }
      
      if (bestPiece === null && (x === size-1 || x === 0) && (y === size-1 || y === 0)) {
        bestPiece = gamePiece;
      }
    }
      
    return bestPiece || that.findAvailablePiece();
  }
  
  this.findAvailablePiece = function() {
    var availPieces = that.findAvailablePieces(),
        numPieces = availPieces.length,
        randomPieceIdx = Math.round(Math.random() * numPieces);
        
    return (numPieces > 0) ? availPieces[randomPieceIdx] : null;
  }
  
  this.findAvailablePieces = function() {
    var availPieces = [];
    for (var x = 0; x < size; x++) {
      for (var y = 0; y < size; y++) {
        var gamePiece = that.board[x][y];
        if (gamePiece.owner() === false) {
          availPieces.push(gamePiece);
        }
      }
    }
    
    return availPieces;
  }
}