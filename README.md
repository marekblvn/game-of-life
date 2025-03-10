## Game of Life
#### What is the Game of Life?
The Game of Life, also known as Conway's Game of Life or simply Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. It is Turing complete and can simulate a universal constructor or any other Turing machine. (from [Wikipedia: Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life))
#### Rules
The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

1.  Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2.  Any live cell with two or three live neighbours lives on to the next generation.
3.  Any live cell with more than three live neighbours dies, as if by overpopulation.
4.  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed, live or dead; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations. (from [Wikipedia: Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life))
#### What is this project?
This is a free-time project I made in 2023. The goal was to create the cellular automaton in JavaScript using [p5.js](https://p5js.org/). The project deployment is available [here](https://marekblvn.github.io/game-of-life/).
#### Controls
- **Live and dead cells**
  - Live cells are <ins>white</ins>, dead cells are *black*.
- **Pausing / resuming the simulation**
  - You can pause or resume the simulation by pressing `Enter`
- **Drawing live cells**
  - While the simulation is paused, you can make cells live (paint them white) by holding left mouse button while hovering over the dead (black) cells.
  - While the simulation is paused, you can make cells dead (pain them black) by holding `Backspace` while hovering over live cells.
- **Restarting the simulation**
  - The simulation can be restarted by refreshing the page. There currently is no other way of reloading, since the page refreshing method is sufficient.
 

<br />
<br />
Marek Balvin, 2025
