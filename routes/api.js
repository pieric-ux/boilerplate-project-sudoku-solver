'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      solver.resetState();
      
      solver.validate(puzzle, coordinate, value, 'check');
      if (solver.error) {
        return res.json({ error: solver.error });
      }
            
      const row = coordinate.charAt(0).toUpperCase();
      const column = coordinate.charAt(1);
      const isSameValue = solver.checkCoordinatePlacement(puzzle, row, column, value);
      if (!isSameValue) {
        solver.checkRowPlacement(puzzle, row, column, value);
        solver.checkColPlacement(puzzle, row, column, value);
        solver.checkRegionPlacement(puzzle, row, column, value);
      }
      if (!solver.valid) {
        return res.json({ valid: false, conflict: solver.conflict });
      }
      res.json({ valid: true });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      
      solver.validate(puzzle, null, null, 'solve');
      if (solver.error) {
        return res.json({ error: solver.error });
      }
      
      const solution = solver.solve(puzzle);
      if(!solution) {
        res.json({ error: 'Puzzle cannot be solved' });
      }

      res.json({ solution: solution });
    });
};
