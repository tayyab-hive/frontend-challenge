/* 
  Ideally this function should be placed in a separate file to be latter imported in other file.
  But since currently we are not running it using an http server and directly opening it by clicking on the html file it will be blocked by the CORS browser policy hence for now defining it like this. 
*/

/**
   * Utility function to shuffle a 2d array.
   *
   * @param {Array<Array<any>>} arr 2d Array to shuffle
   ** @return {Array<Array<any>>} shuffled array
   */
const shuffle2DArray = (arr)=>{
  if(!arr.length) return arr;

  const sizeOfRow = arr[0].length;
  let tempArray = arr.reduce((prevValue,currentValue)=>[...prevValue,...currentValue],[]);
    
    for (let i = tempArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
    }

    resultArray = [];
    while(tempArray.length) resultArray = [...resultArray,tempArray.splice(0,sizeOfRow)];
    return resultArray;
}

/* 
  Defining some common constants which will be used by over main program
*/

// A variable to hold reference to all of tiles
const tiles = document.querySelectorAll('.tile');

// Directions in which a tile can move to
// can be computed by using  X_DIRECTIONS[index] + Y_DIRECTIONS[index]
const X_DIRECTIONS = [0, 0, 1, -1];
const Y_DIRECTIONS = [1, -1, 0, 0];

// A variable that holds current grid size
const CURRENT_GRID_SIZE = 9;

(() => {
  // A 2d array which holds the current state of board.
  let state = [[1, 2, 3], [4, 5, 6], [7, 8, null]];

  /**
   * Checks if tile safe to move to a tile
   *
   * @param {number} row Row of the tile where we want to move tile.
   * @param {number} col Column of the tile where we want to move tile.
   ** @return {boolean} if tile can move to square
   */
  const isSafe = (row, col) => {
    return (
      row > -1 &&
      row < state.length &&
      col > -1 &&
      col < state[0].length &&
      !state[row][col]
    );
  };

   /**
   * Give position of a tile
   *
   * @param {number} row Row of the tile for which we want to find the position.
   * @param {number} col Column of the tile for which we want to find the position.
   ** @return {Array<int>} Position of a title in 2d plane
   */
  const getStyleForPosition = (row, col) => {
    return [`${row*100}px`,`${col*100}px`];
  };

   /**
   * Computes the indexes from state against the given number
   *
   * @param {number} value value for which indexes is supposed to be computed.
   * @return {Array<int>} indexes against the param provided
   */
  const getIndexes = value => {
    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        if (state[i][j] == value) {
          return [i, j];
        }
      }
    }
    return null;
  };

   /**
   * Check if puzzle is solved.
   *
   * @return {boolean} if puzzle is solved.
   */
  const isSolved = () => {
    let isWin = true;
    for (let i = 1; i < CURRENT_GRID_SIZE; i++) {
      const expectedRow = Math.floor((i - 1) / 3);
      const expectedCol = (i - 1) % 3;
      const [row, col] = getIndexes(i);

      if (expectedRow !== row || expectedCol !== col) {
        isWin = false;
        break;
      }
    }
    return isWin;
  };

   /**
   * Shuffle and render board.
   */
  const initializeGame = () => {
    state = shuffle2DArray(state);
    renderBoard();
  };

   /**
   * A higher order function that bind a tile with it's click function.
   *
   * @param {number} value Tile for whose click the function will be bound.
   */
  const handleClick = value => () => {
    const [initialI, initialJ] = getIndexes(value);

    for (let i = 0; i < X_DIRECTIONS.length; i++) {
      const destinationI = initialI + X_DIRECTIONS[i];
      const destinationJ = initialJ + Y_DIRECTIONS[i];

      if (isSafe(destinationI, destinationJ)) {
        state[destinationI][destinationJ] = state[initialI][initialJ];
        state[initialI][initialJ] = null;
        if(!isSolved()){
          renderBoard();
        }else{
          alert('You win!!!');
          initializeGame();
        }
      }
    }
  };

   /**
   * Render board on screen using the tiles.
   */
  const renderBoard = () => {
    tiles.forEach((tile, index) => {
      const [row, col] = getIndexes(index + 1);
      const [left,top]  = getStyleForPosition(row, col)
      tile.style.left = left;
      tile.style.top = top;
    });
  };

   /**
   * Initialize our game.
   * Assign events to tiles and figcaption.
   * Entry point of our code.
   */
  const main = () => {
    document
      .getElementsByTagName('figcaption')[0]
      .addEventListener('click', () => {
        initializeGame();
      });

    tiles.forEach((tile, index) => {
      tile.addEventListener('click', handleClick(index + 1));
    });
    initializeGame();
  };

  main();
})();
