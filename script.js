let tileSize = 16;
let grid = [];
let nextGrid = [];
let gridWidth, gridHeight;
let paused = true;

function setup() {
  frameRate(30);
  let canvasW = windowWidth - (windowWidth % tileSize) - tileSize;
  let canvasH = windowHeight - (windowHeight % tileSize) - tileSize;
  gridWidth = Math.floor(canvasW / tileSize);
  gridHeight = Math.floor(canvasH / tileSize);
  createCanvas(canvasW, canvasH);
  for (let y = 0; y < gridHeight; y++) {
    let row = [];
    for (let x = 0; x < gridWidth; x++) {
      row.push({
        state: 0,
        nextState: 0,
      });
    }
    grid.push(row);
  }
}

function draw() {
  background(220);
  if (paused) {
    _runPaused();
  } else {
    _run();
  }
}

function _runPaused() {
  cursor("pointer");
  stroke("#f9f9f9"); // #191919
  strokeWeight(0.1);
  _pausedDraw();
}

function _run() {
  cursor("auto");
  stroke("#191919"); // #f9f9f9
  noStroke();
  _drawCurrentGeneration();
  _calculateNextGeneration();
  _applyGenerationalChanges();
}

function _pausedDraw() {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (grid[y][x].state === 0) {
        fill("#191919");
        if (mouseIsPressed && _mouseOverTile(x, y)) {
          grid[y][x].state = 1;
        }
      } else if (grid[y][x].state === 1) {
        fill("#f9f9f9");
      }
      square(x * tileSize, y * tileSize, tileSize);
    }
  }
}

function _drawCurrentGeneration() {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (grid[y][x].state === 0) {
        fill("#191919");
      } else if (grid[y][x].state === 1) {
        fill("#f9f9f9");
      }
      square(x * tileSize, y * tileSize, tileSize);
    }
  }
}

function _calculateNextGeneration() {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let liveNeighbours = _getLiveNeighbourCount(x, y);
      if (grid[y][x].state === 1) {
        if (liveNeighbours < 2 || liveNeighbours > 3) {
          grid[y][x].nextState = 0;
        } else {
          grid[y][x].nextState = 1;
        }
      } else {
        if (liveNeighbours === 3) {
          grid[y][x].nextState = 1;
        } else {
          grid[y][x].nextState = 0;
        }
      }
    }
  }
}

function _applyGenerationalChanges() {
  let futureGrid = [];
  for (let y = 0; y < gridHeight; y++) {
    futureGrid[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      futureGrid[y][x] = { state: grid[y][x].nextState, nextState: 0 };
    }
  }
  grid = futureGrid;
}

function _getLiveNeighbourCount(tileX, tileY) {
  let neighbours = [
    grid[mod(tileY - 1, gridHeight)][mod(tileX - 1, gridWidth)].state,
    grid[mod(tileY - 1, gridHeight)][tileX].state,
    grid[mod(tileY - 1, gridHeight)][mod(tileX + 1, gridWidth)].state,
    grid[tileY][mod(tileX - 1, gridWidth)].state,
    grid[tileY][mod(tileX + 1, gridWidth)].state,
    grid[mod(tileY + 1, gridHeight)][mod(tileX - 1, gridWidth)].state,
    grid[mod(tileY + 1, gridHeight)][tileX].state,
    grid[mod(tileY + 1, gridHeight)][mod(tileX + 1, gridWidth)].state,
  ];
  let liveNeighbours = neighbours.filter((n) => n === 1);
  return liveNeighbours;
}

function keyPressed() {
  switch (keyCode) {
    case ENTER:
      paused = false;
      break;
    case ESCAPE:
      paused = true;
      break;
  }
}

function _mouseOverTile(tileX, tileY) {
  return (
    mouseX > tileX * tileSize &&
    mouseX < tileX * tileSize + tileSize &&
    mouseY > tileY * tileSize &&
    mouseY < tileY * tileSize + tileSize
  );
}

const mod = (n, m) => ((n % m) + m) % m;
