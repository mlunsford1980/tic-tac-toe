// Code goes here

function repeat(action, iterations) {
  for (var i = 0; i < iterations; i++) {
    action();
  } 
}

function GameBoard(parent,size) {
  var counter = 0;
  var controller = new UserController(); 
  var that = this;
  controller.initialize();
  
  this.board = [[],[],[]];
  this.x = 0; 
  this.y = 0;
  
  this.newRow = function() {
    return counter % size === 0;
  }
  
  this.endRowIfNeeded = function(square) {
    if (this.newRow()) {
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
  
  this.displayWinInDirection = function(start, direction) {
    while (start !== null) {
      $('#' + start.x + '-' + start.y).addClass('winner');
      start = start.adjacentPieces[direction];
    }
  }
  
  this.searchForWin = function() {
    var gamePiece = null;
    for (var i = 0; i < size; i++) {
      gamePiece = that.board[0][i];
      if (gamePiece.owner() && that.searchInDirection(gamePiece.owner(), gamePiece, 'e')) {
        that.declareWin(gamePiece.owner());
        that.displayWinInDirection(gamePiece, 'e');
      }
      
      gamePiece = that.board[i][0];
      if (gamePiece.owner() && that.searchInDirection(gamePiece.owner(), gamePiece, 's')) {
        that.declareWin(gamePiece.owner());
      }
    }
      
    gamePiece = that.board[0][0];
    if (gamePiece.owner() && that.searchInDirection(gamePiece.owner(), gamePiece, 'se')) {
      that.declareWin(gamePiece.owner());
    }
      
    gamePiece = that.board[0][size-1];
    if (gamePiece.owner() && that.searchInDirection(gamePiece.owner(), gamePiece, 'ne')) {
      that.declareWin(gamePiece.owner());
    }
  }
  
  this.declareWin = function(user) {
    var gamePiece;
    $('#result').text(user + ' wins!');
    for (var x = 0; x < size; x++) {
      for (var y = 0; y < size; y++) {
        $('#' + x + '-' + y).off();
      }
    }
  }
}

function UserController() {
  this.currentUser = 'circle';
  
  this.newTurn = function() {
    this.currentUser = this.currentUser === 'x' ? 'circle' : 'x';
  }
  
  this.initialize = function() {
    $('#user-indicator').text(this.currentUser === 'x' ? 'X' : 'O');
  }
}

function GamePiece(board, target, controller, x, y) {
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
  var that = this;
  var square = $(target);
  
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
  
  this.claimForUser = function (user) {
    square.addClass(user); 
    $('#user-indicator').text(user === 'x' ? 'X' : 'O');
  }
  
  this.makeMove = function() {
    if (that.isAvailable()) {
      that.claimForUser(controller.currentUser);
      controller.newTurn();
      board.searchForWin();
    }
  }
  
  this.isAdjacent = function(x, y) {
    var xDistance = Math.abs(x-this.x);
    var yDistance = Math.abs(y-this.y);
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

$(document).ready(function() {
  var gameBoard = new GameBoard($('#foo'), 3);
  gameBoard.createBoard($('#foo'), 3);
   
});