/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(
    p1,
    p2,
    HEIGHT = 6,
    WIDTH = 7,
    defaultPlayerOneColor = 'blue',
    defaultPlayerTwoColor = 'red'
  ) {
    this.players = [p1, p2];
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    (this.defaultPlayerOneColor = defaultPlayerOneColor),
      (this.defaultPlayerTwoColor = defaultPlayerTwoColor),
      (this.currPlayer = p1); // active player: 1 or 2
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.gameIsOver = false;
  }

  /* start the game when user clicks the start button
   */

  startGame() {
    this.makeBoard(); // Create a fresh gameBoard data structure
    this.makeHtmlBoard(); // Create a fresh HTML Board for the new game
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   
   */
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

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
        /*I am creating and appending a span element inside each cell so I can style it to make it look like a circle in the middle.
         */
        const span = document.createElement('span');
        span.setAttribute('class', 'circle');
        cell.append(span);
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
    piece.style.backgroundColor = this.currPlayer.color;
    //***********Don't think this line does anything
    // piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    /**
     *  I met a bootstrap modal congradulating the winner. I'm using set time out so it give the piece time to fall down.
     */
    window.setTimeout(() => {
      let alert = document.getElementById('alert');
      alert.innerHTML = `
      <div id="myModal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${msg}</h5>
           
          </div>
          <div class="modal-body">
            Congrats! You are the Connect 4 Champion!
            
          </div>
          <div class="modal-footer">
           
           
            <button type="button" onclick="window.location.reload();" class="btn btn-primary" >Play Again</button>
          </div>
        </div>
      </div>
    </div>
      `;
      $('#myModal').modal('show');
    }, 1001);
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
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      this.gameIsOver = true;
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];

    // changes color of current player text right when piece falls
    window.setTimeout(() => {
      let nextPlayer = document.getElementById('nextPlayer');
      nextPlayer.innerText = this.currPlayer.color;
      if (this.currPlayer === 1) {
        nextPlayer.style.color = this.currPlayer.color.toString();
      } else {
        nextPlayer.style.color = this.currPlayer.color.toString();
      }
    }, 1001);
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    let x, y;

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
          this.board[y][x] === this.currPlayer
      );
    };

    for (y = 0; y < this.HEIGHT; y++) {
      for (x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3]
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x]
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3]
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3]
        ];

        // find winner (only checking each win-possibility as needed)
        // if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
        if (
          _win(horiz, x, y) ||
          _win(vert, x, y) ||
          _win(diagDR, x, y) ||
          _win(diagDL, x, y)
        ) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

//Game Instructions. init open and close button. toggle between classes
const open = document.getElementById('open');
const close = document.getElementById('close');

// function for opening instructions. adding classes
open.addEventListener('click', () => {
  const navBlack = document.querySelector('.nav-black'),
    navRed = document.querySelector('.nav-red'),
    navWhite = document.querySelector('.nav-white'),
    navContainer = document.querySelector('.nav-container'),
    navText = document.querySelector('.nav-text');

  navBlack.classList.add('visible');
  navRed.classList.add('visible');
  navWhite.classList.add('visible');
  navContainer.classList.add('visible');
  navText.classList.add('visible');
});

// function for closing instructions. removing classes
close.addEventListener('click', () => {
  const navBlack = document.querySelector('.nav-black'),
    navRed = document.querySelector('.nav-red'),
    navWhite = document.querySelector('.nav-white'),
    navContainer = document.querySelector('.nav-container'),
    navText = document.querySelector('.nav-text');

  navBlack.classList.remove('visible');
  navRed.classList.remove('visible');
  navWhite.classList.remove('visible');
  navContainer.classList.remove('visible');
  navText.classList.remove('visible');
});

//init restart button
const restart = document.getElementById('restart-game');

restart.addEventListener('click', function() {
  // init alert div
  let alert = document.getElementById('alert');
  // adding modal bootstrap component
  alert.innerHTML = `
        <div id="myModal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Are you a quitter?</h5>
             
            </div>
            <div class="modal-body">
              are you sure you want to restart
              
            </div>
            <div class="modal-footer">
             
              <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close">No</button>
              <button type="button" onclick="window.location.reload();" class="btn btn-primary" >Yes</button>
            </div>
          </div>
        </div>
      </div>
        `;
  //Bootstrap snipit to manually open modal
  $('#myModal').modal('show');
});

/**
 * This code checks to see if the colored entered in valid and returns true if it is
 */
isValidColor = strColor => {
  let s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
};

/**
 * Get Player's input values, validates them and if the color is invalid, it displays an error

 */
const validatePlayerInput = () => {
  const defaultPlayerOneColor = 'blue';
  const defaultPlayerTwoColor = 'red';

  // Player form fields
  const player1ColorInputField = document.getElementById('p1-color');
  const player2ColorInputField = document.getElementById('p2-color');

  // Get player input
  let player1ColorInputValue = player1ColorInputField.value
    .trim()
    .toLowerCase();
  let player2ColorInputValue = player2ColorInputField.value
    .trim()
    .toLowerCase();

  // display default color if there was no player color input
  player1Color =
    player1ColorInputValue === ''
      ? defaultPlayerOneColor
      : player1ColorInputField.value.trim().toLowerCase();
  player2Color =
    player2ColorInputValue === ''
      ? defaultPlayerTwoColor
      : player2ColorInputField.value.trim().toLowerCase();
  player1ColorInputField.value = player1Color;
  player2ColorInputField.value = player2Color;

  // Error will be diplayed if color is invalid and will not be able to proceed

  if (!isValidColor(player1ColorInputValue)) {
    const p1ErrMsg = `Player 1: '${
      document.getElementById('p1-color').value
    }' is not a valid color please try another color`;

    displayErrorMsg(p1ErrMsg);
    player1Color = null; // Null value will prevent game from being initiated
  }

  if (!isValidColor(player2ColorInputValue)) {
    const p2ErrMsg = `Player 2: color '${
      document.getElementById('p2-color').value
    }' is not a valid color please try another color`;

    displayErrorMsg(p2ErrMsg);
    player2Color = null;
  }

  return {
    player1Color,
    player2Color
  };
};

errorMsgDiv = () => {
  const errMsgDiv = document.createElement('div');
  errMsgDiv.setAttribute(
    'class',
    'alert alert-danger alert-dismissible fade show'
  );
  errMsgDiv.setAttribute('role', 'alert');

  return errMsgDiv;
};

errorMsgBtn = () => {
  const errMsgBtn = document.createElement('button');
  errMsgBtn.setAttribute('class', 'close');
  errMsgBtn.innerHTML = '&times;';
  return errMsgBtn;
};

errorMsgText = errMsgText => {
  const errMsgTxtSpan = document.createElement('span');
  errMsgTxtSpan.setAttribute('class', 'err-msg-txt');
  errMsgTxtSpan.innerText = errMsgText;
  return errMsgTxtSpan;
};

displayErrorMsg = errMsgText => {
  const errMsgArea = document.getElementById('error-message');

  const errMsgDiv = errorMsgDiv();
  const errMsgBtn = errorMsgBtn();
  const errMsgTxt = errorMsgText(errMsgText);

  errMsgDiv.append(errMsgBtn);
  errMsgDiv.append(errMsgTxt);
  errMsgArea.append(errMsgDiv);

  // Disable game start game button until all error messages have been cleared
  document.getElementById('start-btn').disabled = true;
};

const handleGameStart = () => {
  let player1, player2;

  let playerColors = validatePlayerInput();

  // if valid color entered for player1 then create player 1
  if (playerColors.player1Color) {
    player1 = new Player(playerColors.player1Color);
  }

  // if valid color entered for player2 then create player 2
  if (playerColors.player2Color) {
    player2 = new Player(playerColors.player2Color);
  }

  // Game will not be started until both player's colors are valid
  if (playerColors.player1Color && playerColors.player2Color) {
    let connect4 = new Game(player1, player2);
    connect4.startGame();
    // Hide player inputs
    document.getElementById('player-input').classList.add('invisible');
  }

  // changes color of current player text right when piece falls

  let nextPlayer = document.getElementById('nextPlayer');
  nextPlayer.innerText = currPlayer.color;
};

/**
 * when error message is removed, the players input will be cleared
 * Put focus and cursor on error input field so user can change color value
 */
const clearError = val => {
  const errMsgText = val.nextSibling.innerText;
  const player1Input = document.getElementById('p1-color');
  const player2Input = document.getElementById('p2-color');

  if (errMsgText.includes('Player 1')) {
    player1Input.value = '';
    player1Input.focus();
    player1Input.select();
  } else {
    player2Input.value = '';
    player2Input.focus();
    player2Input.select();
  }
};
// Remove Div containing the error message and it's delete button from the DOM
function deleteErrorMsg(deleteBtnClicked) {
  const errMsgDiv = deleteBtnClicked.parentNode;
  errMsgDiv.parentNode.removeChild(errMsgDiv);
}

/**
 * remove the error message when the user clicks it's delete button
 * Re-enable start game button
 */
function handleDeleteBtn(evt) {
  const errMsgArea = document.getElementById('error-message');
  const startBtn = document.getElementById('start-btn');
  const val = evt.target;

  if (val.nodeName === 'BUTTON') {
    /* Only handle click events on the errorMsg delete button
    remove color input and set cursor focus and position in input field */

    clearError(val);
    deleteErrorMsg(val);
    /**
     * enable start button when all error messages have been cleared
     */
    if (errMsgArea.childElementCount === 0) {
      startBtn.disabled = false;
    }
  }
}

/* init Start Button event listner*/
document.querySelector('#start-btn').addEventListener('click', handleGameStart);

/* User clicks delete button for error message */
document
  .querySelector('#error-message')
  .addEventListener('click', handleDeleteBtn);
