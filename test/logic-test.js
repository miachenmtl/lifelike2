var expect = require("chai").expect;
// var conway = require("../lifelike-logic");
var testing = require("../lifelike-logic.js");

describe("Give Cell Life", function() {
  it("assigns life to the specified cell", function() {
    var state;
    testing.giveCellLife(10, 8);
    testing.giveCellLife(10, 10);
    state = testing.getCellState(10, 8);
    expect(state).to.equal(true);
  });
});

describe("Kill Cell", function() {
  it("makes the specified cell dead", function() {
    var state = [];
    testing.killCell(10, 8);
    state[0] = testing.getCellState(10, 8);
    state[1] = testing.getCellState(10, 10);
    expect(state[0]).to.equal(false);
    expect(state[1]).to.equal(true);
  });
});

describe("Get Cell State", function() {
  it("returns undefined if outside the field", function() {
    var state = [];
    state[0] = testing.getCellState(-1, 8);
    state[1] = testing.getCellState(4, 60);
    expect(state[0]).to.equal(undefined);
    expect(state[1]).to.equal(undefined);
  });
});

describe("Kill Everything", function() {
  it("resets every cell to dead", function() {
    var state = [];
    testing.giveCellLife(36, 59);
    testing.giveCellLife(0, 0);
    testing.killEverything();
    state[0] = testing.getCellState(36, 59);
    state[1] = testing.getCellState(0, 0);
    expect(state[0]).to.equal(false);
    expect(state[1]).to.equal(false);
  });
});

describe("Count Neighborhood", function() {
  var count = [];
  it("counts the number of cells alive in the Moore neighborhood of top left corner", function() {
    testing.giveCellLife(0, 0); // This looks like:
    testing.giveCellLife(0, 2); // O-O--
    testing.giveCellLife(1, 3); // ---O-
    testing.giveCellLife(2, 1); // -OO--
    testing.giveCellLife(2, 2); // ----O
    testing.giveCellLife(3, 4); // ---OO
    testing.giveCellLife(4, 3);
    testing.giveCellLife(4, 4);
    count[0] = testing.countNeighborhood(0, 0);
    expect(count[0]).to.equal(0);
  });
  it("counts the number of cells alive in the Moore neighborhood along top edge", function() {
    count[0] = testing.countNeighborhood(0, 1);
    count[1] = testing.countNeighborhood(0, 2);
    count[2] = testing.countNeighborhood(0, 3);
    count[3] = testing.countNeighborhood(0, 4);
    expect(count[0]).to.equal(2);
    expect(count[1]).to.equal(1);
    expect(count[2]).to.equal(2);
    expect(count[3]).to.equal(1);
  });
  it("counts the number of cells alive in the Moore neighborhood along left edge", function() {
    count[0] = testing.countNeighborhood(1, 0);
    count[1] = testing.countNeighborhood(2, 0);
    count[2] = testing.countNeighborhood(3, 0);
    count[3] = testing.countNeighborhood(4, 0);
    expect(count[0]).to.equal(2);
    expect(count[1]).to.equal(1);
    expect(count[2]).to.equal(1);
    expect(count[3]).to.equal(0);
  });
  it("counts the number of cells alive in the Moore neighborhood in the middle", function() {
    count[0] = testing.countNeighborhood(1, 1);
    count[1] = testing.countNeighborhood(1, 2);
    count[2] = testing.countNeighborhood(1, 3);
    count[3] = testing.countNeighborhood(1, 4);
    count[4] = testing.countNeighborhood(2, 3);
    count[5] = testing.countNeighborhood(3, 4);
    count[6] = testing.countNeighborhood(4, 4);
    expect(count[0]).to.equal(4);
    expect(count[1]).to.equal(4);
    expect(count[2]).to.equal(2);
    expect(count[3]).to.equal(1);
    expect(count[4]).to.equal(3);
    expect(count[5]).to.equal(2);
    expect(count[6]).to.equal(2);
  });
});

describe("Count neighborhood dblchk", function() {
  it("counts the number of cells alive in the Moore neighborhood", function() {
    var count = [];
    testing.killEverything();
    testing.giveCellLife(1, 1); // This looks like:
    testing.giveCellLife(1, 2); // -----
    testing.giveCellLife(1, 3); // -OOO-
    testing.giveCellLife(2, 1); // -OOO-
    testing.giveCellLife(2, 2); // -OOO-
    testing.giveCellLife(2, 3); // -----
    testing.giveCellLife(3, 1);
    testing.giveCellLife(3, 2);
    testing.giveCellLife(3, 3);
    count[0] = testing.countNeighborhood(0, 0);
    count[1] = testing.countNeighborhood(0, 1);
    count[2] = testing.countNeighborhood(0, 2);
    count[3] = testing.countNeighborhood(0, 3);
    count[4] = testing.countNeighborhood(0, 4);
    count[5] = testing.countNeighborhood(1, 0);
    count[6] = testing.countNeighborhood(1, 1);
    count[7] = testing.countNeighborhood(1, 2);
    count[8] = testing.countNeighborhood(1, 3);
    count[9] = testing.countNeighborhood(1, 4);
    count[10] = testing.countNeighborhood(2, 0);
    count[11] = testing.countNeighborhood(2, 1);
    count[12] = testing.countNeighborhood(2, 2);
    count[13] = testing.countNeighborhood(2, 3);
    count[14] = testing.countNeighborhood(2, 4);
    count[15] = testing.countNeighborhood(3, 0);
    count[16] = testing.countNeighborhood(3, 1);
    expect(count[0]).to.equal(1);
    expect(count[1]).to.equal(2);
    expect(count[2]).to.equal(3);
    expect(count[3]).to.equal(2);
    expect(count[4]).to.equal(1);
    expect(count[5]).to.equal(2);
    expect(count[6]).to.equal(3);
    expect(count[7]).to.equal(5);
    expect(count[8]).to.equal(3);
    expect(count[9]).to.equal(2);
    expect(count[10]).to.equal(3);
    expect(count[11]).to.equal(5);
    expect(count[12]).to.equal(8);
    expect(count[13]).to.equal(5);
    expect(count[14]).to.equal(3);
    expect(count[15]).to.equal(2);
    expect(count[16]).to.equal(3);
  });
});
