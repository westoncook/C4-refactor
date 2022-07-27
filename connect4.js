


/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
let playerArr = []

class Game{
  constructor(Height = 6, Width = 7, playerArr){
    this.HEIGHT = Height,
    this.WIDTH = Width,
    this.players = playerArr,
    this.numPlayers = playerArr.length,
    this.currPlayer = playerArr[0],
    this.nextPlayer = 1,
    this.board = [],
    this.makeBoard(),
    this.makeHtmlBoard()
    this.activateRestartBtn()
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    this.handleClick = this.handleClick.bind(this);
    top.addEventListener('click', this.handleClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer.num}`);
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    const top = document.querySelector('#column-top');
    top.removeEventListener('click', this.handleClick)
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.num;
    this.placeInTable(y, x);
    
    // check for win
    
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.num} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.getNextPlayer();
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = cells => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer.num
      );
    }
    

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  newGame(){
    document.querySelector('#board').remove();
    const newTable = document.createElement('table');
    newTable.id = 'board';
    document.querySelector('#game').append(newTable);
    // chooses random player to start
    this.nextPlayer = Math.floor(Math.random() * (this.numPlayers));
    console.log(this.nextPlayer);
    this.getNextPlayer();

    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
  }

  getNextPlayer(){
    this.currPlayer = this.players[this.nextPlayer];
    this.nextPlayer += 1;
    if(this.nextPlayer === this.numPlayers){
      this.nextPlayer = 0;
    } 
  }

  

  activateRestartBtn(){
    const restartBtn = document.querySelector('#restart');
    restartBtn.addEventListener('click', this.newGame.bind(this));
  }


}

class Player{
  constructor(num, color){
    if (typeof color !== 'string'){
      throw new Error('color must be a string')
    }
    this.num = num,
    this.color = color
  }
}




function colorSubmit(e){
  e.preventDefault();
  colorArr = ['red', 'blue', 'green', 'yellow']
  const colorInpts = document.querySelectorAll('input');
  for (let i = 0; i < colorInpts.length; i++){
    let inpt = colorInpts[i].value;
    if(inpt){
      inpt = inpt.strip().toLowercase();
      playerArr.push(new Player(i + 1, inpt));
    } else {
      playerArr.push(new Player(i + 1, colorArr[i]))
    }
  }
  document.querySelector('form').remove()
  createRestartBtn(6,7,playerArr)
  new Game(6, 7, playerArr);
}

function createRestartBtn(height, width, playerArr){
  const restartBtn = document.createElement('button');
  restartBtn.innerText = 'Restart (with current settings)';
  restartBtn.id = 'restart';
  const form = document.createElement('form');
  const resetBtn = document.createElement('button');
  resetBtn.innerText = 'Reset (erase current settings)';
  resetBtn.id = 'reset';
  form.append(resetBtn);
  document.querySelector('#game').prepend(form);
  document.querySelector('#game').prepend(restartBtn);
}

const playersBtn = document.querySelector('button');
playersBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  const playerNum = document.querySelector('select').value
  document.querySelector('form').remove();
  let form = document.createElement('form');
  for(let i = 1; i <= playerNum; i++){
    let label = document.createElement('label');
    let inpt = document.createElement('input');
    let br = document.createElement('br');
    label.for = i;
    label.innerText =  `Player ${i} Enter Color: `
    inpt.type = 'text';
    inpt.id = i;
    form.append(label, inpt, br)
  }
  const colorSubmitBtn = document.createElement('button');
  colorSubmitBtn.innerText = 'Start Game';
  colorSubmitBtn.addEventListener('click', colorSubmit);
  form.append(colorSubmitBtn);
  document.querySelector('#game').prepend(form);
  
})

