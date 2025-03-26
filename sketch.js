const CELL_SIZE = 16;
let SELECTED_FPS = 24;
const PAUSED_FPS = 60;
let FPS = PAUSED_FPS;
let BOARD = [];
let BOARD_DIMENSIONS = { width: undefined, height: undefined };
let IS_ERASING = false;
let PAUSED = true;
let ELAPSED_TIME = 0;

function _mouseOverCell(row, col) {
  return (
    mouseX > col * CELL_SIZE &&
    mouseX < col * CELL_SIZE + CELL_SIZE &&
    mouseY > row * CELL_SIZE &&
    mouseY < row * CELL_SIZE + CELL_SIZE
  );
}

function _getAdjacentCells(row, col) {
  const left = (col - 1 + BOARD_DIMENSIONS.width) % BOARD_DIMENSIONS.width;
  const right = (col + 1) % BOARD_DIMENSIONS.width;
  const up = (row - 1 + BOARD_DIMENSIONS.height) % BOARD_DIMENSIONS.height;
  const down = (row + 1) % BOARD_DIMENSIONS.height;

  return [
    BOARD[row][left], // Left
    BOARD[row][right], // Right
    BOARD[up][col], // Up
    BOARD[down][col], // Down
    BOARD[up][left], // Top-left corner
    BOARD[up][right], // Top-right corner
    BOARD[down][left], // Bottom-left corner
    BOARD[down][right], // Bottom-right corner
  ];
}

function _tryPaintCell(row, col) {
  if (IS_ERASING) return;
  if (mouseIsPressed && mouseButton === LEFT && _mouseOverCell(row, col)) {
    BOARD[row][col] = 1;
  }
}

function _tryEraseCell(row, col) {
  if (
    IS_ERASING &&
    mouseIsPressed &&
    mouseButton === LEFT &&
    _mouseOverCell(row, col)
  ) {
    BOARD[row][col] = 0;
  }
}

function _drawBoardPaused() {
  for (let row = 0; row < BOARD_DIMENSIONS.height; row++) {
    for (let col = 0; col < BOARD_DIMENSIONS.width; col++) {
      if (BOARD[row][col] === 0) {
        fill("#f9f9f9");
        _tryPaintCell(row, col);
      } else {
        fill("#191919");
        _tryEraseCell(row, col);
      }
      square(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE);
    }
  }
}

function _drawBoard() {
  for (let y = 0; y < BOARD_DIMENSIONS.height; y++) {
    for (let x = 0; x < BOARD_DIMENSIONS.width; x++) {
      if (BOARD[y][x] === 0) {
        fill("#f9f9f9");
      } else {
        fill("#191919");
      }
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
    }
  }
}

function _calculateNextIteration() {
  const NEXT_ITERATION_BOARD = [];
  for (let row = 0; row < BOARD_DIMENSIONS.height; row++) {
    NEXT_ITERATION_BOARD.push(new Array(BOARD_DIMENSIONS.width).fill(0));
    for (let col = 0; col < BOARD_DIMENSIONS.width; col++) {
      let aliveNeighbors = _getAdjacentCells(row, col).filter(
        (cell) => cell === 1
      ).length;
      if (BOARD[row][col] === 1) {
        if (aliveNeighbors < 2 || aliveNeighbors > 3) {
          NEXT_ITERATION_BOARD[row][col] = 0;
        } else {
          NEXT_ITERATION_BOARD[row][col] = 1;
        }
      } else if (aliveNeighbors === 3) {
        NEXT_ITERATION_BOARD[row][col] = 1;
      } else {
        NEXT_ITERATION_BOARD[row][col] = 0;
      }
    }
  }
  BOARD = [...NEXT_ITERATION_BOARD];
}

function _invertCellColor() {
  for (let row = 0; row < BOARD_DIMENSIONS.height; row++) {
    for (let col = 0; col < BOARD_DIMENSIONS.width; col++) {
      BOARD[row][col] = BOARD[row][col] ? 0 : 1;
    }
  }
}

function _cleanBoard() {
  for (let row = 0; row < BOARD_DIMENSIONS.height; row++) {
    for (let col = 0; col < BOARD_DIMENSIONS.width; col++) {
      BOARD[row][col] = 0;
    }
  }
}

function _runPaused() {
  cursor("pointer");
  stroke("#808080");
  strokeWeight(0.1);
  _drawBoardPaused();
}

function _run() {
  cursor("auto");
  stroke("#f9f9f9");
  noStroke();
  _drawBoard();
  _calculateNextIteration();
}

function _initializeEventListeners() {
  const runButton = document.getElementById("run-button");
  const eraserButton = document.getElementById("eraser-button");
  const fpsSelect = document.getElementById("fps-select");
  const paintButton = document.getElementById("paint-button");
  const refreshButton = document.getElementById("refresh-button");

  refreshButton.addEventListener("click", () => {
    if (!PAUSED) return;
    _cleanBoard();
  });

  paintButton.addEventListener("click", () => {
    if (!PAUSED) return;
    _invertCellColor();
  });

  eraserButton.addEventListener("click", () => {
    if (!PAUSED) return;
    IS_ERASING = !IS_ERASING;
    if (IS_ERASING) {
      eraserButton.classList.add("active");
    } else {
      eraserButton.classList.remove("active");
    }
  });

  runButton.addEventListener("click", () => {
    PAUSED = !PAUSED;
    if (!PAUSED) {
      runButton.classList.add("active");
      IS_ERASING = false;
      eraserButton.classList.remove("active");
      fpsSelect.setAttribute("disabled", "true");
    } else {
      runButton.classList.remove("active");
      fpsSelect.removeAttribute("disabled");
    }
    const runButtonIcon = document.querySelector("#run-button img");
    if (!PAUSED) {
      runButtonIcon.src = "./static/icons/pause.png";
    } else {
      runButtonIcon.src = "./static/icons/run.png";
    }
  });

  fpsSelect.addEventListener("change", (event) => {
    SELECTED_FPS = parseInt(event.target.value);
  });
}

function setup() {
  _initializeEventListeners();
  const canvasElement = document.getElementById("canvas");
  let canvas = createCanvas(
    canvasElement.offsetWidth - 2,
    canvasElement.offsetHeight - 2,
    P2D,
    canvasElement
  );
  canvas.parent("canvas-container");
  BOARD_DIMENSIONS = {
    width: Math.floor(width / CELL_SIZE),
    height: Math.floor(height / CELL_SIZE),
  };
  for (let y = 0; y < BOARD_DIMENSIONS.height; y++) {
    BOARD.push(new Array(BOARD_DIMENSIONS.width).fill(0));
  }
}

function draw() {
  if (PAUSED) {
    FPS = PAUSED_FPS;
  } else {
    FPS = SELECTED_FPS;
  }
  const timeStep = 1000 / FPS;
  ELAPSED_TIME += deltaTime;
  frameRate(FPS);
  if (ELAPSED_TIME >= timeStep) {
    if (PAUSED) {
      _runPaused();
    } else {
      _run();
    }
  }
  ELAPSED_TIME -= timeStep;
}
