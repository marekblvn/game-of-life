let tileSize = 16;
let grid = [];
let gridX, gridY;
let paused = true;

// TODO: Fix gridWidth and gridHeight

function setup() {
  frameRate(30);
  let canvasW = windowWidth - (windowWidth % tileSize) - tileSize;
  let canvasH = windowHeight - (windowHeight % tileSize) - tileSize;
  createCanvas(canvasW, canvasH);
  for (let h = 0; h < height; h++) {
    let row = [];
    for (let w = 0; w < width; w++) {
      row.push(0);
    }
    grid.push(row);
  }
  gridX = grid[0].length;
  gridY = grid.length;
}

function draw() {
  if (paused) {
    _pausedDraw();
  } else {
    _runningDraw();
    _runCycle();
  }
}

// TODO: Refactor this into buttons for better UX
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

function _pausedDraw() {
  background(220);
  for (let y = 0; y < gridY; y++) {
    for (let x = 0; x < gridX; x++) {
      stroke(0, 0, 0);
      strokeWeight(0.1);
      if (grid[y][x] === 0) {
        fill(255, 255, 255);
        if (mouseIsPressed) {
          // fix clicking
          if (_mouseInsideTile(y, x)) {
            grid[y][x] = 1;
          }
        }
      } else if (grid[y][x] === 1) {
        fill(0, 0, 0);
      }
      square(x * tileSize, y * tileSize, tileSize);
    }
  }
}

function _runningDraw() {
  background(220);
  for (let y = 0; y < gridY; y++) {
    for (let x = 0; x < gridX; x++) {
      stroke(0, 0, 0);
      strokeWeight(0.1);
      if (grid[y][x] === 0) {
        fill(255, 255, 255);
      } else if (grid[y][x] === 1) {
        fill(0, 0, 0);
      }
      square(x * tileSize, y * tileSize, tileSize);
    }
  }
}

function _runCycle() {
  /**
   * 1. If LIVE cell has less than 2 alive neighbors, it dies
   * 2. If LIVE cell has 2 or 3 alive neighbors, it remains ALIVE
   * 3. If LIVE cell has more than 3 alive neighbors, it dies
   * 4. If DEAD cell has exactly 3 alive neighbors, it becomes alive.
   */
  for (let y = 0; y < gridY; y++) {
    for (let x = 0; x < gridX; x++) {
      //fix this function
      let aliveCells = _getAliveNeighbours(x, y);
      if (grid[y][x] === 0) {
        if (aliveCells === 3) {
          grid[y][x] = 1;
        }
      } else if (grid[y][x] === 1) {
        if (aliveCells < 2) {
          grid[y][x] = 0;
        } else if (aliveCells > 3) {
          grid[y][x] = 0;
        }
      }
    }
  }
}

function _getAliveNeighbours(x, y) {
  // top row
  const neighbours = [
    grid[mod(x - 1, gridWidth)][mod(y - 1, gridHeight)],
    grid[mod(x - 1, gridWidth)][mod(y, gridHeight)],
    grid[mod(x - 1, gridWidth)][mod(y + 1, gridHeight)],
    grid[x][mod(y - 1, gridHeight)],
    grid[x][mod(y + 1, gridHeight)],
    grid[mod(x + 1, gridWidth)][mod(y - 1, gridHeight)],
    grid[mod(x + 1, gridWidth)][mod(y, gridHeight)],
    grid[mod(x + 1, gridWidth)][mod(y + 1, gridHeight)],
  ];
  const aliveNeighbours = neighbours.filter((item) => item === 1);
  return aliveNeighbours;
}

function _mouseInsideTile(x, y) {
  return (
    mouseX > x * tileSize &&
    mouseX < x * tileSize + tileSize &&
    mouseY > y * tileSize &&
    mouseY < y * tileSize + tileSize
  );
}

const mod = (n, m) => ((n % m) + m) % m;
