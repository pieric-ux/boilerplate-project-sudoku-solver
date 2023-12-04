const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
  suiteSetup(() => {
    solver = new Solver();
  });
  
  test('Logic handles a valid puzzle string of 81 characters', function() {
    const puzzle = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
    solver.resetState();
    solver.validate(puzzle, null, null, 'solve');
    assert.isEmpty(solver.error);
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
    const puzzle = '8..........A6......7..9.2...5...7....B..457.....1...3...1.C..68..85...1..9....4..';
    solver.resetState();
    solver.validate(puzzle, null, null, 'solve');
    assert.equal(solver.error, 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', function() {
    const puzzle = '..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4.';
    solver.resetState();
    solver.validate(puzzle, null, null, 'solve');
    assert.equal(solver.error, 'Expected puzzle to be 81 characters long');
  });

  test('Logic handles a valid row placement', function() {
    const puzzle = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
    const row = 'A';
    const column = '6';
    const value = '3';
    solver.resetState();
    solver.checkRowPlacement(puzzle, row, column, value);
    assert.isTrue(solver.valid);
  });

  test('Logic handles an invalid row placement', function() {
    const puzzle = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
    const row = 'A';
    const column = '6';
    const value = '8';
    solver.resetState();
    solver.checkRowPlacement(puzzle, row, column, value);
    assert.equal(solver.conflict, 'row');
  });

  test('Logic handles a valid column placement', function() {
    const puzzle = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
    const row = 'A';
    const column = '6';
    const value = '3';
    solver.resetState();
    solver.checkColPlacement(puzzle, row, column, value);
    assert.isTrue(solver.valid);
  });

  test('Logic handles an invalid column placement', function() {
    const puzzle = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
    const row = 'A';
    const column = '6';
    const value = '7';
    solver.resetState();
    solver.checkColPlacement(puzzle, row, column, value);
    assert.equal(solver.conflict, 'column');
  });

  test('Logic handles a valid region (3x3 grid) placement', function() {
    const puzzle = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
    const row = 'A';
    const column = '6';
    const value = '3';
    solver.resetState();
    solver.checkRegionPlacement(puzzle, row, column, value);
    assert.isTrue(solver.valid);
  });

  test('Logic handles an invalid region (3x3 grid) placement', function() {
    const puzzle = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
    const row = 'A';
    const column = '6';
    const value = '9';
    solver.resetState();
    solver.checkRegionPlacement(puzzle, row, column, value);
    assert.equal(solver.conflict, 'region');
  });

  test('Valid puzzle strings pass the solver', function() {
    const puzzle = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
    solver.resetState();
    assert.equal(solver.solve(puzzle), '812753649943682175675491283154237896369845721287169534521974368438526917796318452');
  });

  test('Invalid puzzle strings fail the solver', function() {
    const puzzle = '123..........4..........4...5.3.....4...6..19..1.......7..5.........6.9.6..9...21';
    solver.resetState();
    assert.isNull(solver.solve(puzzle));
  });

  test('Solver returns the expected solution for an incomplete puzzle', function() {
    const puzzle = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
    solver.resetState();
    assert.equal(solver.solve(puzzle), '812753649943682175675491283154237896369845721287169534521974368438526917796318452');
  });
});
