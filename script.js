const cellSize = 16;
let running_fps = 12;
let paused_fps = 60;
let board = [];
let paused = true;
let eraseMode = false;
let boardHeight, boardWidth;

function setup() {
  frameRate(paused_fps);
  const canvasWidth = windowWidth - (windowWidth % cellSize) - cellSize;
  const canvasHeight = windowHeight - (windowHeight % cellSize) - cellSize;
  boardWidth = Math.floor(canvasWidth / cellSize);
  boardHeight = Math.floor(canvasHeight / cellSize);
  createCanvas(canvasWidth, canvasHeight);
  for (let h = 0; h < boardHeight; h++) {
    board.push(new Array(boardWidth).fill(0));
  }
}

function draw() {
  background(220);
  if (paused) {
    frameRate(paused_fps);
    cursor("pointer");
    stroke("#f9f9f9");
    strokeWeight(0.1);
    _drawBoard();
    console.log("paused");
  } else {
    frameRate(running_fps);
    cursor("auto");
    stroke("#191919");
    noStroke();
    _drawBoard();
    _prepareNextTurn();
    console.log("running");
  }
}

function keyPressed() {
  switch (keyCode) {
    case ENTER:
      paused = !paused;
      break;
    case BACKSPACE:
      eraseMode = true;
      break;
  }
}

function keyReleased() {
  switch (keyCode) {
    case BACKSPACE:
      eraseMode = false;
      break;
  }
}

function _drawBoard() {
  for (let h = 0; h < boardHeight; h++) {
    for (let w = 0; w < boardWidth; w++) {
      if (board[h][w] === 0) {
        fill("#191919");
        if (
          mouseIsPressed &&
          mouseButton === LEFT &&
          _mouseOverCell(w, h) &&
          paused
        ) {
          board[h][w] = 1;
        }
      } else if (board[h][w] === 1) {
        fill("#f9f9f9");
        if (eraseMode && _mouseOverCell(w, h) && paused) {
          board[h][w] = 0;
        }
      }
      square(w * cellSize, h * cellSize, cellSize);
    }
  }
}

function _prepareNextTurn() {
  const nextBoard = [];
  for (let h = 0; h < boardHeight; h++) {
    nextBoard.push(new Array(boardWidth).fill(0));
    for (let w = 0; w < boardWidth; w++) {
      let aliveNeighbours = 0;
      if (board[mod(h - 1, boardHeight)][mod(w - 1, boardWidth)] === 1) {
        aliveNeighbours += 1;
      }
      if (board[mod(h - 1, boardHeight)][w] === 1) {
        aliveNeighbours += 1;
      }
      if (board[mod(h - 1, boardHeight)][mod(w + 1, boardWidth)] === 1) {
        aliveNeighbours += 1;
      }
      if (board[h][mod(w - 1, boardWidth)] === 1) {
        aliveNeighbours += 1;
      }
      if (board[h][mod(w + 1, boardWidth)] === 1) {
        aliveNeighbours += 1;
      }
      if (board[mod(h + 1, boardHeight)][mod(w - 1, boardWidth)] === 1) {
        aliveNeighbours += 1;
      }
      if (board[mod(h + 1, boardHeight)][w] === 1) {
        aliveNeighbours += 1;
      }
      if (board[mod(h + 1, boardHeight)][mod(w + 1, boardWidth)] === 1) {
        aliveNeighbours += 1;
      }
      if (board[h][w] === 1) {
        if (aliveNeighbours < 2 || aliveNeighbours > 3) {
          nextBoard[h][w] = 0;
        } else {
          nextBoard[h][w] = 1;
        }
      } else {
        if (aliveNeighbours === 3) {
          nextBoard[h][w] = 1;
        } else {
          nextBoard[h][w] = 0;
        }
      }
    }
  }
  board = nextBoard.slice();
}

function _mouseOverCell(x, y) {
  return (
    mouseX > x * cellSize &&
    mouseX < x * cellSize + cellSize &&
    mouseY > y * cellSize &&
    mouseY < y * cellSize + cellSize
  );
}

const mod = (n, m) => ((n % m) + m) % m;
