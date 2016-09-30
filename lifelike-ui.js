/* global logic:true, makeField */

var graphics = {
/** When user loads the page or changes grid size, it draws grid lines on the
  * canvas
  * @param {number} height Number of rows in grid
  * @param {number} width Number of columns in grid
  */
  drawGridLines: function(height, width) {
    var i;
    var j;
    var pixHeight = 10 * height + 1; // height of field in pixels
    var pixWidth = 10 * width + 1; // width of field in pixels
    var canvas = document.getElementById("fieldOfLife");
    var c = canvas.getContext("2d");
    c.lineWidth = 1;
    c.strokeStyle = "#8888FF";
    // draw vertical lines
    for (i = 0.5; i < pixWidth; i += 10) { // Add .5 to avoid antialiasing
      c.moveTo(i, 0);
      c.lineTo(i, pixHeight);
      c.stroke();
    }
    // draw horizontal lines
    for (j = 0.5; j < pixHeight; j += 10) { // Add .5 to avoid antialiasing
      c.moveTo(0, j);
      c.lineTo(pixWidth, j);
      c.stroke();
    }
  },
/** Makes a cell alive in the UI
  * @param {number} i The row number
  * @param {number} j The column number
  */
  fillCell: function(i, j) {
    var cellX; // x coordinate of top left corner of cell
    var cellY; // y coordinate of top left corner of cell
    cellX = 10 * j + 1;
    cellY = 10 * i + 1;
    var canvas = document.getElementById("fieldOfLife");
    var c = canvas.getContext("2d");
    c.fillStyle = "#00FF00";
    c.fillRect(cellX, cellY, 9, 9);
  },
/** Makes a cell dead in the UI
  * @param {number} i The row number
  * @param {number} j The column number
  */
  clearCell: function(i, j) {
    var cellX; // x coordinate of top left corner of cell
    var cellY; // y coordinate of top left corner of cell
    cellX = 10 * j + 1;
    cellY = 10 * i + 1;
    var canvas = document.getElementById("fieldOfLife");
    var c = canvas.getContext("2d");
    c.fillStyle = "#FFFFFF";
    c.fillRect(cellX, cellY, 9, 9);
  },
  /** Resizes the grid when user changes selection
    */
  resizeGrid: function() {
    var sizeIndex = document.getElementById("gridsize").selectedIndex;
    switch (sizeIndex) {
      case 0: // small 25 x 25
        killEverything();
        document.getElementById("fieldOfLife").width = 251;
        document.getElementById("fieldOfLife").height = 251;
        this.drawGridLines(25, 25);
        logic = makeField(25, 25);
        break;
      default:
      case 1: // medium 37 x 60
        killEverything();
        document.getElementById("fieldOfLife").width = 601;
        document.getElementById("fieldOfLife").height = 371;
        this.drawGridLines(37, 60);
        logic = makeField(37, 60);
        break;
      case 2: // large 62 x 100
        killEverything();
        document.getElementById("fieldOfLife").width = 1001;
        document.getElementById("fieldOfLife").height = 621;
        this.drawGridLines(62, 100);
        logic = makeField(62, 100);
        break;
      case 3: // huge 100 x 162
        killEverything();
        document.getElementById("fieldOfLife").width = 1621;
        document.getElementById("fieldOfLife").height = 1001;
        this.drawGridLines(100, 162);
        logic = makeField(100, 162);
        break;
    }
  }
};

var canvasCalc = {
  /** Invoked when user clicks on canvas, toggles state of cell clicked on
    * @param {object} event The mouse event object
    */
  processClickOnCanvas: function(event) {
    var xyCoords = this.getCanvasCoordinates(event);
    var r; // Row of cell clicked on
    var c; // Column of cell clicked on
    var rcCoords = this.isOnCell(xyCoords[0], xyCoords[1]);
    console.log("The user clicked on " + xyCoords[0] + ", " + xyCoords[1]);
    console.log("Row and column are: " + rcCoords);
    if (rcCoords[0] === -1 && rcCoords[1] === -1) { // JS does not like to compare arrays!
      console.log("User clicked on gridline.");
      return;
    }
    r = rcCoords[0];
    c = rcCoords[1];
    // If cell is alive, switch to dead, else do the reverse
    if (logic.getCellState(r, c)) {
      logic.killCell(r, c);
      graphics.clearCell(r, c);
    } else {
      logic.giveCellLife(r, c);
      graphics.fillCell(r, c);
    }
  },

  /** Takes coordinates relative to window,returns coordinates relative to canvas
    * @param {object} event The Mouse Event object
    * @return {Array} xyCoords x and y coordinates relative to canvas
    */
  getCanvasCoordinates: function(event) {
    var canvas = document.getElementById("fieldOfLife");
    var rect = canvas.getBoundingClientRect();
    var x = parseInt(event.clientX - rect.left, 10) - 2;
    var y = parseInt(event.clientY - rect.top, 10) - 2;
    return [x, y];
  },

  /** Determines whether click is on a cell or not
  * @param {number} x x coordinate of click relative to canvas
  * @param {number} y y coordinate of click relative to canvas
  * @return {Array} rcCoords row and column number
  */
  isOnCell: function(x, y) { // returns row and column number user clicks on, or [-1, -1] if user clicks on gridline
    var rcCoords = [0, 0]; // row and column numbers to be returned
    if (x % 10 === 0 || y % 10 === 0) {
      rcCoords = [-1, -1];
      return (rcCoords);
    }
    rcCoords[0] = (y - (y % 10)) / 10;
    rcCoords[1] = (x - (x % 10)) / 10;
    return (rcCoords);
  }
};

/** Invoked by Reset and Resize Grid, clears all cells
  */
function killEverything() {
  var i;
  var j;
  var canvasHeight = document.getElementById("fieldOfLife").height;
  var canvasWidth = document.getElementById("fieldOfLife").width;
  var numRows = (canvasHeight - 1) / 10;
  var numCols = (canvasWidth - 1) / 10;
  for (i = 0; i < numRows; i++) {
    for (j = 0; j < numCols; j++) {
      logic.killCell(i, j);
      graphics.clearCell(i, j);
    }
  }
}

var nextGenCalc = {
  /** Looks at the checkboxes for the number of cells necessary to create life
    * @return {Array} birthRuleset An array of booleans corresponding to checked boxes
    */
  getBirthRuleset: function() {
    var birthRuleset = [];
    birthRuleset[0] = document.getElementById("B0").checked;
    birthRuleset[1] = document.getElementById("B1").checked;
    birthRuleset[2] = document.getElementById("B2").checked;
    birthRuleset[3] = document.getElementById("B3").checked;
    birthRuleset[4] = document.getElementById("B4").checked;
    birthRuleset[5] = document.getElementById("B5").checked;
    birthRuleset[6] = document.getElementById("B6").checked;
    birthRuleset[7] = document.getElementById("B7").checked;
    birthRuleset[8] = document.getElementById("B8").checked;
    return birthRuleset;
  },

  /** Looks at the checkboxes for the number of cells necessary to create life
    * @return {Array} surviveRuleset An array of booleans corresponding to checked boxes
    */
  getSurviveRuleset: function() {
    var surviveRuleset = [];
    surviveRuleset[0] = document.getElementById("S0").checked;
    surviveRuleset[1] = document.getElementById("S1").checked;
    surviveRuleset[2] = document.getElementById("S2").checked;
    surviveRuleset[3] = document.getElementById("S3").checked;
    surviveRuleset[4] = document.getElementById("S4").checked;
    surviveRuleset[5] = document.getElementById("S5").checked;
    surviveRuleset[6] = document.getElementById("S6").checked;
    surviveRuleset[7] = document.getElementById("S7").checked;
    surviveRuleset[8] = document.getElementById("S8").checked;
    return surviveRuleset;
  },

  /** Replaces current array of booleans with next generation's array
    * Also calls functions to update the UI
    * @param {array} nextGenState The next generation
    */
  populateNextGen: function(nextGenState) {
    var i;
    var j;
    var numRows = nextGenState.length;
    var numCols = nextGenState[0].length;
    for (i = 0; i < numRows; i++) {
      for (j = 0; j < numCols; j++) {
        if (nextGenState[i][j]) {
          logic.giveCellLife(i, j);
          graphics.fillCell(i, j);
        } else {
          logic.killCell(i, j);
          graphics.clearCell(i, j);
        }
      }
    }
  },

  /** Invoked by Step and by Run--SetInterval, calculates next generation
    */
  iterateNextGen: function() {
    var i;
    var j;
    var count;
    var nextGenState = [];
    var canvasHeight = document.getElementById("fieldOfLife").height;
    var canvasWidth = document.getElementById("fieldOfLife").width;
    var numRows = (canvasHeight - 1) / 10;
    var numCols = (canvasWidth - 1) / 10;
    var birthRuleset = this.getBirthRuleset();
    var surviveRuleset = this.getSurviveRuleset();
    // initialize nextGenState as array of array of booleans
    for (i = 0; i < numRows; i++) {
      nextGenState[i] = [];
      for (j = 0; j < numCols; j++) {
        nextGenState[i][j] = false;
      }
    }
    console.log("iterating next generation");
    for (i = 0; i < numRows; i++) {
      for (j = 0; j < numCols; j++) {
        count = logic.countNeighborhood(i, j);
        if (logic.getCellState(i, j) && surviveRuleset[count]) { // cell is alive, check survive ruleset
          nextGenState[i][j] = true;
        } else if (logic.getCellState(i, j) === false && birthRuleset[count]) { // cell is dead, check birth ruleset
          nextGenState[i][j] = true;
        } else {
          nextGenState[i][j] = false;
        }
      }
    }
    this.populateNextGen(nextGenState);
  }
};
/** IIFE to be used for run/Stop
  */
var runStop = (function() {
  var intervalID;
  var speedIndex = 2;
  var interval = 500;
  return {
    setSpeed: function() {
      speedIndex = document.getElementById("speed").selectedIndex;
      switch (speedIndex) {
        case 0:
          interval = 1000;
          break;
        default:
        case 1:
          interval = 500;
          break;
        case 2:
          interval = 250;
          break;
        case 3:
          interval = 100;
          break;
      }
    },
    run: function() {
      document.getElementById("speed").disabled = true;
      intervalID = window.setInterval(function() {
        nextGenCalc.iterateNextGen();
      }, interval);
      document.getElementById("runStop").value = "Stop";
      console.log("Run");
    },
    stop: function() {
      document.getElementById("speed").disabled = false;
      window.clearInterval(intervalID);
      document.getElementById("runStop").value = "Run";
      console.log("Stop");
    }
  };
})();

/** Invoked by Run/Stop button, iterates next generation twice every second
  */
function processRunStop() {
  var text = document.getElementById("runStop").value;
  if (text === "Run") {
    runStop.run();
  } else {
    runStop.stop();
  }
}
