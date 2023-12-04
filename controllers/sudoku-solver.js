class SudokuSolver {

  constructor() {
    this.valid = true;
    this.error = '';
    this.conflict = [];
  }

  resetState() {
    this.valid = true;
    this.error = '';
    this.conflict = [];
  }

  getRowValues(puzzleString, rowIndex) {
    return puzzleString.slice(rowIndex * 9, rowIndex * 9 + 9);
  }

  getColumnValues(puzzleString, columnIndex) {
    let columnValues = '';
    for (let row = 0; row < 9; row++) {
      columnValues += puzzleString[columnIndex + row * 9];
    }
    return columnValues;
  }

  getRegionValues(puzzleString, rowIndex, columnIndex) {
    let regionValues = '';
    const regionRowStart = rowIndex - (rowIndex % 3);
    const regionColumnStart = columnIndex - (columnIndex % 3);
    for (let row = regionRowStart; row < regionRowStart + 3; row++) {
      for (let column = regionColumnStart; column < regionColumnStart + 3; column++) {
        regionValues += puzzleString[row * 9 + column];
      }
    }
    return regionValues;
  }

  getFirstEmptyCell(puzzleString) {
    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i] === '.') {
        const row = String.fromCharCode(65 + Math.floor(i / 9));
        const column = (i % 9) + 1;
        
        return [row, column.toString()];
      }
    }
    return null;
  }

  validate(puzzleString, coordinate = '', value = '', route) {
    this.resetState();

    if (route === 'check') {
      if (!puzzleString || !coordinate || !value) {
        return this.error = 'Required field(s) missing';
      }

      if (coordinate.length > 2) {
        return this.error = 'Invalid coordinate';
      }

      const row = coordinate.charAt(0).toUpperCase();
      const column = coordinate.charAt(1);
      if (!/^[A-I]$/.test(row) || !/^[1-9]$/.test(column)) {
        return this.error = 'Invalid coordinate';
      }

      if(/[^1-9]/.test(value)) {
        return this.error = 'Invalid value';
      }
    }

    if (route === 'solve') {
      if (!puzzleString) {
        return this.error = 'Required field missing';
      }
    }
    
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return this.error = 'Invalid characters in puzzle';
    }
    
    if (puzzleString.length !== 81) {
      return this.error = 'Expected puzzle to be 81 characters long';
    }

  }
  
  checkCoordinatePlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 65;
    const columnIndex = column - 1;

    if (puzzleString[rowIndex * 9 + columnIndex] === value) {
      return true;
    }
    
    return false;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 65;
    const rowValues = this.getRowValues(puzzleString, rowIndex);

    if (rowValues.includes(value)) { 
        this.valid = false;
        this.conflict = [...this.conflict, 'row'];
    }
    
    return;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const columnIndex = column - 1;
    const columnValues = this.getColumnValues(puzzleString, columnIndex);
    if (columnValues.includes(value)) {
      this.valid = false;
      this.conflict = [...this.conflict, 'column'];
    }

    return;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 65;
    const columnIndex = column - 1;
    const regionValues = this.getRegionValues(puzzleString, rowIndex, columnIndex);

    if (regionValues.includes(value)) {
      this.valid = false;
      this.conflict = [...this.conflict, 'region'];
    }

    return;
  }

  solve(puzzleString) {
    const firstEmptyCell = this.getFirstEmptyCell(puzzleString);
    
    if (!firstEmptyCell) {
      return puzzleString;
    }
    
    const [row, column] = firstEmptyCell;

    for (let num = 1; num <= 9; num++) {
      this.resetState();
      const value = num.toString();
      
      this.checkRowPlacement(puzzleString, row, column, value);
      this.checkColPlacement(puzzleString, row, column, value);
      this.checkRegionPlacement(puzzleString, row, column, value);

      if (this.valid) {
        const puzzleArray = puzzleString.slice().split('');
        puzzleArray[(row.charCodeAt(0) - 65) * 9 + parseInt(column) - 1] = value;
        const updatedPuzzle = puzzleArray.join('');
        const result = this.solve(updatedPuzzle);

        if (result) {
          return result;
        }
      }
    }
    return null;
  }

}

module.exports = SudokuSolver;

