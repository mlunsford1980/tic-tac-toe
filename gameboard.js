

function GameBoard(parent,size, controller) {
  var counter = 0;
  var that = this;
  controller.initialize();
  this.board = [];
  for (var i = 0; i < size; i++) {
    this.board.push([]);
  }
  this.x = 0; 
  this.y = 0;
  
  this.endRowIfNeeded = function(square) {
    var newRow = counter % size === 0;
    
    if (newRow) {
      square.addClass('breaker');
    }
  }
  
  this.createSquare = function() {
    var square = $('<span>');
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
      _.times(size, that.createSquare);
      that.y += 1;
    }
    _.times(size, createRow);
    for (var x = 0; x < size; x++) {
      for (var y = 0; y < size; y++) {
        radio('newGamePieceEvent').broadcast(that.board[x][y]);
      }
    }
  }
  
  this.searchForWin = function() {
    var winDetected = false,
        gamePiece = null;
    for (var i = 0; i < size; i++) {
      gamePiece = that.board[0][i];
      winDetected = winDetected || that.searchForWinInDirection(gamePiece, 'e');
      
      gamePiece = that.board[i][0];
      winDetected = winDetected || that.searchForWinInDirection(gamePiece, 's');
    }
      
    gamePiece = that.board[0][0];
    winDetected = winDetected || that.searchForWinInDirection(gamePiece, 'se');
    
    gamePiece = that.board[0][size-1];
    winDetected = winDetected || that.searchForWinInDirection(gamePiece, 'ne');
    
    return winDetected;
  }
  
  this.searchForWinInDirection = function(gamePiece, direction) {
    var winDetected = false;
    if (gamePiece.owner() && that.searchInDirection(gamePiece.owner(), gamePiece, direction)) {
        that.endGame(gamePiece.owner() + ' wins!');
        that.displayWinInDirection(gamePiece, direction);
        winDetected = true;
    }
    
    return winDetected;
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
    // Remove event handlers from all pieces
    $('#game-board span').off();
    
    $('#status').text(message);
  }
  
  this.displayWinInDirection = function(start, direction) {
    while (start !== null) {
      $('#' + start.x + '-' + start.y).addClass('winner');
      start = start.adjacentPieces[direction];
    }
  } 
  
  this.findBestPiece = function(user, difficulty) {
    var availPieces = that.findAvailablePieces(),
        numPieces = availPieces.length,
        bestPiece = null,
        gamePiece = null,
        isCornerPiece = null,
        isCenterPiece = null;
    
    var x, y;
    for (var i = 0; i < numPieces; i++) {
      gamePiece = availPieces[i];
      x = gamePiece.x;
      y = gamePiece.y;
      isMiddlePiece = size % 2 == 1 && x === y && x === Math.floor(size/2);
      isCornerPiece = (x === size-1 || x === 0) && (y === size-1 || y === 0);
      
      if (isMiddlePiece) {
        bestPiece = gamePiece;
      }
      
      if (bestPiece === null && isCornerPiece) {
        bestPiece = gamePiece;
      }
    }
    
    if (difficulty === 'hard') {
      var winningPiece = that.findWinningPiece(user);
      var winningPiece = winningPiece || that.findWinningPiece((user === 'x' ? 'circle' : 'x'));
      
      if (winningPiece) {
        bestPiece = winningPiece;
      }
    }
      
    return bestPiece || that.findAvailablePiece();
  }
  
  this.findAvailablePiece = function() {
    var availPieces = that.findAvailablePieces(),
        numPieces = availPieces.length,
        randomPieceIdx = Math.round(Math.random() * (numPieces - 1));
        
    return (numPieces > 0) ? availPieces[randomPieceIdx] : null;
  }
  
  this.findAvailablePieces = function() {
    var isAvailable = function(gamePiece) {
      return gamePiece.owner() === false;
    };
    
    return _.filter(_.flatten(that.board), isAvailable);
  }
  
  this.findWinningPiece = function(user) {
    var gamePiece = null, 
        winningPiece = null;
        
    for (var i = 0; i < size; i++) {
      gamePiece = that.board[0][i];
      winningPiece = winningPiece || that.findWinningPieceInDirection(gamePiece, 'e', user);
      
      gamePiece = that.board[i][0];
      winningPiece = winningPiece || that.findWinningPieceInDirection(gamePiece, 's', user);
    }
      
    gamePiece = that.board[0][0];
    winningPiece = winningPiece || that.findWinningPieceInDirection(gamePiece, 'se', user);
    
    gamePiece = that.board[0][size-1];
    winningPiece = winningPiece || that.findWinningPieceInDirection(gamePiece, 'ne', user);
    
    return winningPiece;
  }
  
  this.findWinningPieceInDirection = function(start, direction, user) {
    var userPieces = [],
        availPieces = [];
        
    while (start !== null) {
      if (start.owner() === user) {
        userPieces.push(start);
      }
      
      if (start.owner() !== 'circle' && start.owner() !== 'x') {
        availPieces.push(start);
      }
      start = start.adjacentPieces[direction];
    }
    
    if (userPieces.length === size - 1 && availPieces.length === 1) {
      return availPieces[0];
    } else {
      return null;
    }
  }
}