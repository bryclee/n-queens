/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var solution = new Board({n:n});
  var foundSolution = false;

  var placeRookN = function(row) {


    for (var i=0; i<n; i++) {
      solution.togglePiece(row, i);
      if (!solution.hasAnyColConflicts()){
        if (row === n-1){
          foundSolution = true;
          return 
        }
        placeRookN(row + 1);
      }
      if (foundSolution) {
        return;
      }
      solution.togglePiece(row, i);
    }
  }

  placeRookN(0);
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solution = new Board({n:n});
  var solutionCount = 0;
  var doublingFactor = 2;



  var placeRookN = function(row, possibleColumns) {

      // Compute half of first row
    if (row === 0){
      var l = Math.ceil(n/2);
    } else {
      l = possibleColumns.length;
    }

    for (var i = 0; i < l; i++){

      // Avoid double counting placing queen in middle
      // of first row
      if (row===0 && i===l-1 && n%2===1){
        doublingFactor = 1;
      }
    

      var index = possibleColumns[i];
      solution.togglePiece(row, index);

      if (row === n-1){
        solutionCount += doublingFactor;
        solution.togglePiece(row, index);
        return;
        }

      placeRookN(row + 1, possibleColumns.slice(0,i).concat(possibleColumns.slice(i+1)));
      
      solution.togglePiece(row, index);
    }
  }
  placeRookN(0, _.range(n));
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = new Board({n:n}); //fixme
  var foundSolution = false;

  var placeQueenN = function(row, possibleColumns){
    for (var i = 0; i < possibleColumns.length; i++){
      var index = possibleColumns[i];
      solution.togglePiece(row, index);
      if (!solution.hasMajorDiagonalConflictAt(index - row) &&
          !solution.hasMinorDiagonalConflictAt(index + row)){
        if (row === n - 1){
          foundSolution = true;
          return;
        }
        placeQueenN(row + 1, possibleColumns.slice(0,i).concat(possibleColumns.slice(i + 1)));
      }
      if (foundSolution)
        return;
      solution.togglePiece(row, index);
    }
  }
  placeQueenN(0, _.range(n));
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution.rows();
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
/*window.countNQueensSolutions = function(n) {
  var solution = new Board({n:n}); 
  var solutionCount = 0;
  var doublingFactor = 2;

  if (n === 0)
    return 1;

  var placeQueenN = function(row, possibleColumns){

    // Compute half of first row
    if (row === 0){
      var l = Math.ceil(n/2);
    } else {
      l = possibleColumns.length;
    }

    for (var i = 0; i < l; i++){

      // Avoid double counting placing queen in middle
      // of first row
      if (row===0 && i===l-1 && n%2===1){
        doublingFactor = 1;
      }
      var index = possibleColumns[i];
      solution.togglePiece(row, index);
      if (!solution.hasMajorDiagonalConflictAt(index - row) &&
          !solution.hasMinorDiagonalConflictAt(index + row)){
        if (row === n - 1){
          solutionCount += doublingFactor;
          solution.togglePiece(row, index);
          return;
        }
        placeQueenN(row + 1, possibleColumns.slice(0,i).concat(possibleColumns.slice(i + 1)));
      }
      solution.togglePiece(row, index);
    }
  }
  placeQueenN(0, _.range(n));
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};*/

window.countNQueensSolutions = function(n) {
  var solution = Array.apply(null, Array(n)).map(function(i){return 0});
  var solutionCount = 0;
  var doublingFactor = 2;

  if (n === 0) {
    return 1;
  }

  var togglePiece = function(row, index){
    solution[row] = solution[row] ^ (1 << n - index - 1);
  }

  var majorDiagonalConflictAt = function(index) {
    var total = 0;
    for (var i = 0; i < n; i++) {
      total = total ^ ((solution[i] << i) & (1 << (n - index - 1)));
    }
    return total === 0;
  }
  var minorDiagonalConflictAt = function(index) {
    var total = 0;
    for (var i = 0; i < n; i++) {
      total = total ^ ((solution[i] << (n-i-1)) & (1 << (2 * (n-1) - index)));
    }
    return total === 0;
  }

  var placeQueenN = function(row, possibleColumns){

    if (row === 0){
      var l = Math.ceil(n/2);
    } else {
      l = possibleColumns.length;
    }

    for (var i = 0; i < l; i++){
      if (row===0 && i===l-1 && n%2===1){
        doublingFactor = 1;
      }

      var index = possibleColumns[i];
      togglePiece(row, index);

      if (!majorDiagonalConflictAt(index - row) &&
          !minorDiagonalConflictAt(index + row)){
        if (row === n - 1){
          solutionCount += doublingFactor;
          togglePiece(row, index);
          return;
        }
        placeQueenN(row + 1, possibleColumns.slice(0,i).concat(possibleColumns.slice(i + 1)));
      }
      togglePiece(row, index);
    }
  }
  placeQueenN(0, _.range(n));
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
