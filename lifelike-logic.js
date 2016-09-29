/** Creates the private array of arrays of booleans, fills with
  * false, returns methods for manipulation
  * @param {number} fieldHeight height of field in rows
  * @param {number} fieldWidth width of field in columns
  * @return {object} Methods giveCellLife, killCell, getCellState,
  *  killEverything, countNeighborhood.
  */
function makeField(fieldHeight, fieldWidth) {
  var lifeAtRowCol = [];
  var rowNum;
  var colNum;
  for (rowNum = 0; rowNum < fieldHeight; rowNum++) {
    lifeAtRowCol[rowNum] = [];
    for (colNum = 0; colNum < fieldWidth; colNum++) {
      lifeAtRowCol[rowNum][colNum] = false;
    }
  }
  return {
    giveCellLife: function(row, col) {
      lifeAtRowCol[row][col] = true;
    },
    killCell: function(row, col) {
      lifeAtRowCol[row][col] = false;
    },
    getCellState: function(row, col) {
      if (row < 0 || row >= fieldHeight || col < 0 || col >= fieldWidth) {
        return undefined;
      }
      return lifeAtRowCol[row][col];
    },
    killEverything: function() {
      for (rowNum = 0; rowNum < lifeAtRowCol.length; rowNum++) {
        for (colNum = 0; colNum < lifeAtRowCol[rowNum].length; colNum++) {
          lifeAtRowCol[rowNum][colNum] = false;
        }
      }
    },
    countNeighborhood: function(row, col) {
      var count = 0; // Count to be returned
      var i; // adjustment to be made to row
      var j; // adjustment to be made to column
      for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
          if ((i !== 0 || j !== 0) && this.getCellState(row + i, col + j)) {
            count++;
          }
        }
      }
      return count;
    }
  };
}

var logic = makeField(37, 60);

// So that the file can be tested and run in the browser
if ((typeof module !== "undefined") && (typeof module.exports !==
    "undefined")) {
  module.exports = logic;
}
