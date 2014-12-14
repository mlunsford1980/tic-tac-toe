

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
    _.times(size*size, function() {
      var startNewRow = that.x > 0 && that.x % size === 0;
      if (startNewRow) {
        that.x = 0;
        that.y++;
      }
      that.createSquare();
    });
    
    _.forEach(_.flatten(that.board), function(gamePiece) {
        radio('newGamePieceEvent').broadcast(gamePiece);
    });
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
  
  this.searchInDirection = function(player, start, direction) {
    var startOwner = start.owner();
    if (startOwner !== player) {
      return false;
    }
    
    if (startOwner === player && start.adjacentPieces[direction] === null) {
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
    $('#game-info').text('');
  }
  
  this.displayWinInDirection = function(start, direction) {
    var id;
    while (start !== null) {
      id = '#' + start.x + '-' + start.y;
      $(id).addClass('winner');
      start = start.adjacentPieces[direction];
    }
  } 
  
  this.findBestPiece = function(player, difficulty) {
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
      var winningPiece = that.findWinningPiece(player);
      winningPiece = winningPiece || that.findWinningPiece((player === 'x' ? 'circle' : 'x'));
      
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
  
  this.findWinningPiece = function(player) {
    var gamePiece = null, 
        winningPiece = null;
        
    for (var i = 0; i < size; i++) {
      gamePiece = that.board[0][i];
      winningPiece = winningPiece || that.findWinningPieceInDirection(gamePiece, 'e', player);
      
      gamePiece = that.board[i][0];
      winningPiece = winningPiece || that.findWinningPieceInDirection(gamePiece, 's', player);
    }
      
    gamePiece = that.board[0][0];
    winningPiece = winningPiece || that.findWinningPieceInDirection(gamePiece, 'se', player);
    
    gamePiece = that.board[0][size-1];
    winningPiece = winningPiece || that.findWinningPieceInDirection(gamePiece, 'ne', player);
    
    return winningPiece;
  }
  
  this.findWinningPieceInDirection = function(start, direction, player) {
    var playerPieces = [],
        availPieces = [];
        
    while (start !== null) {
      if (start.owner() === player) {
        playerPieces.push(start);
      }
      
      if (start.owner() !== 'circle' && start.owner() !== 'x') {
        availPieces.push(start);
      }
      start = start.adjacentPieces[direction];
    }
    
    if (playerPieces.length === size - 1 && availPieces.length === 1) {
      return availPieces[0];
    } else {
      return null;
    }
  }
}