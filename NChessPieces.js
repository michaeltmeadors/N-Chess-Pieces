/* 
	Function that addes HTML elements that represents a chess board to the DOM.
*/
function createBoard(numRows, numCols) {
// Initial
		var container = createBoardContainerElement();
		var board = createBoardElement();
		var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "S", "Y", "Z"];	
		
// First Row		
		// Fill in th elements for board_header for number of Cols
		var board_header = document.createElement("tr");
		board_header.appendChild(document.createElement("th")); // First cell of table should be empty
		var colCounter = 0;
		for (colCounter; colCounter < numCols ; colCounter++) {
			board_header.appendChild(createLabelElement(alphabet[colCounter])); 
		}
		board.appendChild(board_header); // append header tr to the table
		
// Remaining Rows		
		var rowCounter = 1;
		for (rowCounter; rowCounter <= numRows; rowCounter++) {
		// Initial
			var board_row = document.createElement("tr"); // create new tr element
			
		// Label Col
			board_row.appendChild(createLabelElement(rowCounter));
			
		// Tile Cols
			colCounter = 0; // reset colCounter
			for (colCounter; colCounter < numCols ; colCounter++) {
				board_row.appendChild(createSpaceElement(rowCounter, colCounter+1)); // append td element to the tr 
			}
	
		//
			board.appendChild(board_row); // append tr to the table		
		}
		
		container.appendChild(board);
		document.getElementsByClassName("board-container")[0].appendChild(container);
		
		
		// Set space-counts to initial values
		document.getElementById("space-count-free").textContent = numRows*numCols;
}


/* 
	Function that returns a div HTML element that is to be a container for the chess board.
	Used within createBoard.
*/
function createBoardContainerElement() {
	var element = document.createElement("div");
	element.className = "container-board";
	return element;
}

/* 
	Function that returns a table HTML element that is to be the chess board.
	Used within createBoard.
*/
function createBoardElement() {
	var element = document.createElement("table");
	element.id = "board";
	return element;
}

/* 
	Function that returns a td HTML element that is to be a cell of the chess board.
	Used within createBoard.
*/
function createSpaceElement(row, col) {
	var element = document.createElement("td");
	element.classList.add("space");
	element.classList.add("0");
	element.classList.add("free");
	element.style.backgroundColor = document.getElementById("color-picker-free").value; // background color
	element.addEventListener("click", function() {
			placePiece(event, getSelectedPiece(), row, col);
		});

	return element;
}

/* 
	Function that returns a td HTML element that is to be a label of the chess board.
	Used within createBoard.
*/
function createLabelElement(label) {
	var element = document.createElement("td");
	element.className = "label";
	element.innerHTML = label;
	return element;
}



/* 
	Function that marks which type of piece is selected.
*/
function selectPiece(evt, pieceName) {
	// Get the element that has the selected-piece class and remove it.
	// Need to check if selected is undefined because their is no element that initially has the selected-piece class.
	var selected = document.getElementsByClassName("selected-piece")[0];
	if (selected !== undefined) {
		selected.classList.remove("selected-piece");
	}
	
	// Toggle the selected-piece class for the piece selector that triggered the event.
	// If the clicked element is the element that was already selected, it should not be selected.
	if (selected !== evt.currentTarget) {
			evt.currentTarget.classList.add("selected-piece");
	}
}

/* 
	Function that places a piece on the board.
	evt for the td element that was clicked.
	Piece for the piece symbol to be placed on the board.
*/
function placePiece(evt, piece, row, col) {
	// If space is covered then do not place a piece
	if (evt.currentTarget.classList.contains("covered") && piece !== "") {
		return;
	}
		
	// If space already has a piece on it use the removePiece function.
	if (evt.currentTarget.classList.contains("hasPieceOn")) {
		if (evt.currentTarget.textContent == piece.icon) {
			removePiece(evt.currentTarget, piece, row, col);
			return;
		}
		else {
			removePiece(evt.currentTarget, createPiece(evt.currentTarget), row, col);
		}
	}
	// If a piece is not selected than don't do anything.
	if (piece === "")
	{
		return;
	}
	// Add hasPieceOn class to td element, and set text of td to be a chess piece	
	evt.currentTarget.classList.add("hasPieceOn");
	evt.currentTarget.style.backgroundColor = document.getElementById("color-picker-pieceOn").value; // background color
	evt.currentTarget.classList.remove("free");
	evt.currentTarget.textContent = piece.icon;
	piece.place(row, col);
	
	// Update space counts
	updateSpaceCounts();
	
	return true;
}


function removePiece(space, piece, row, col) {
	// Remove hasPieceOn class from td element, and remove chess piece from td element
	space.classList.remove("hasPieceOn");
	if (space.classList.contains("covered")) {
		space.style.backgroundColor = document.getElementById("color-picker-covered").value; // background color
	}
	else {
		space.classList.add("free");
		space.style.backgroundColor = document.getElementById("color-picker-free").value; // background color
	}
	space.textContent = "";
	piece.remove(row, col);
	
	// Update space counts
	updateSpaceCounts();
	
	return true;
}


function getSelectedPiece() {
	var selected = document.getElementsByClassName("selected-piece")[0];

	if (selected == undefined) {
		return "";
	}
	else {
		var piece = selected.id;
	}
	
	// Return piece object dependent on the id of the selected piece icon
	if (piece == "pawn-selector") {
		return new PawnPiece();
	}
	else if (piece === "knight-selector") {
		return new KnightPiece();
	}
	else if (piece === "bishop-selector") {
		return new BishopPiece();
	}
	else if (piece === "rook-selector") {
		return new RookPiece();
	}
	else if (piece === "queen-selector") {
		return new QueenPiece();
	}
	else if (piece === "king-selector") {
		return new KingPiece();
	}
	else {
		return "";
	}	
}


function createPiece(space) {
	if (space == undefined) {
			return "";
	}
	
	if (space.textContent == "♟") {
		return new PawnPiece();
	}
	else if (space.textContent == "♞") {
		return new KnightPiece();
	}
	else if (space.textContent == "♝") {
		return new BishopPiece();
	}
	else if (space.textContent == "♜") {
		return new RookPiece();
	}
	else if (space.textContent == "♛") {
		return new QueenPiece();
	}
	else if (space.textContent == "♚") {
		return new KingPiece();
	}
	else {
		return "";
	}
}


/* 
	Function that clears the board, resetting it to its orignial form.
	Remove all piece icons from the board and removes any state classes that are not 'free' from spaces.
*/
function clearBoard() {
	var board = document.getElementById("board");
	var rows = board.getElementsByTagName("tr");
	var spaces, space;
	var rowCounter, colCounter;
	for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
		spaces = rows[rowCounter].getElementsByTagName("td");	
		for (colCounter = 1; colCounter < spaces.length; colCounter++) {
			space = spaces[colCounter];
			space.textContent = "";
			space.classList.remove("covered");
			space.classList.remove("hasPieceOn");
			space.classList.add("free");
			space.style.backgroundColor = document.getElementById("color-picker-free").value; // background color
			
			var coveredCount = findNumber(space.classList);			
			space.classList.remove(coveredCount);
			space.classList.add("0");
		}	
	}
	updateSpaceCounts();
}

/* 
	Function triggered by the user that changes the dimensions of the board.
	Clears the board and then sets the board to the dimensions the user choose.
*/
function changeBoardSize() {
	// Should clear the board before resizing it
	clearBoard();
	
	// Get new dimensions
	var rowsSelector = document.getElementById("rows-selector");
	var rows = rowsSelector.options[rowsSelector.selectedIndex].value;
	var colsSelector = document.getElementById("cols-selector");
	var cols = colsSelector.options[colsSelector.selectedIndex].value;
	
	// Remove all content within board-container div element
	var boardContainer = document.getElementsByClassName("board-container")[0];
	boardContainer.innerHTML = "";

	// Create the new board within the board-container div element with the new dimensions
	createBoard(rows, cols);
}


function findNumber(list) {
	var i;
	for (i = 0; i < list.length; i++) {
		if (!isNaN(list[i])) {
			return list[i];
		}
	}
}

/* 
	Function that updates the values of the space-count elements.
	Checks each space for classes that flag the space of being in a certain state (free, hasPieceOn, or covered).
*/
function updateSpaceCounts() {
	var freeCount = 0, hasPieceOnCount = 0, coveredCount = 0;
	var board = document.getElementById("board");
	var rows = board.getElementsByTagName("tr");
	var spaces, space;
	var rowCounter, colCounter;
	
	// loop through board rows
	for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
		spaces = rows[rowCounter].getElementsByTagName("td");
		// check each space in a row
		for (colCounter = 1; colCounter < spaces.length; colCounter++) {
			// check if space's state by checking which state class it has (free, hasPieceOn, or covered)
			
			if (spaces[colCounter].classList.contains("free")) {
				freeCount++;
			}
			if (spaces[colCounter].classList.contains("hasPieceOn")) {
				hasPieceOnCount++;
			}
			if (spaces[colCounter].classList.contains("covered")) {
				coveredCount++;
			}
		}	
	}
	
	// Update the textContents of the appropriate elements to display the found counts
	document.getElementById("space-count-free").textContent = freeCount;
	document.getElementById("space-count-pieceOn").textContent = hasPieceOnCount;
	document.getElementById("space-count-covered").textContent = coveredCount;
}


//////////////////////////////////////////////////////////////////////////////////////////////////
/* 
	Function that updates the colors of the spaces.
	Checks each space for classes that flag the space of being in a certain state (free, hasPieceOn, or covered) and applies correct color.
*/
function updateColors() {
	var board = document.getElementById("board");
	var rows = board.getElementsByTagName("tr");
	var spaces, space;
	var rowCounter, colCounter;
	
	// loop through board rows
	for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
		spaces = rows[rowCounter].getElementsByTagName("td");
		// check each space in a row
		for (colCounter = 1; colCounter < spaces.length; colCounter++) {
			// check if space's state by checking which state class it has (free, hasPieceOn, or covered)
			
			if (spaces[colCounter].classList.contains("free")) {
				spaces[colCounter].style.backgroundColor = document.getElementById("color-picker-free").value; 
			}
			if (spaces[colCounter].classList.contains("hasPieceOn")) {
				spaces[colCounter].style.backgroundColor = document.getElementById("color-picker-pieceOn").value;
			}
			if (spaces[colCounter].classList.contains("covered")) {
				spaces[colCounter].style.backgroundColor = document.getElementById("color-picker-covered").value;
			}
			if (spaces[colCounter].classList.contains("covered") && spaces[colCounter].classList.contains("hasPieceOn")) {
				spaces[colCounter].style.backgroundColor = document.getElementById("color-picker-coveredPiece").value;
			}
		}	
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////////

class Piece {
	constructor(name, icon) {
		this.name = name;
		this.icon = "";
	}
	place(row, col) {
		
	}
	renmove(row, col) {
		
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

class PawnPiece {
	constructor() {
		this.name = "pawn";
		this.icon = "♟";
	}
	place(row, col) {
		var board = document.getElementById("board");
		var rows = board.getElementsByTagName("tr");
		var spaces, space;
		var rowCounter, colCounter;
		for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
			spaces = rows[rowCounter].getElementsByTagName("td");
			
			for (colCounter = 1; colCounter < spaces.length; colCounter++) {
				if ((col == colCounter+1 && row == rowCounter+1) || 
					(col == colCounter+1 && row == rowCounter-1) || 
					(col == colCounter-1 && row == rowCounter+1) || 
					(col == colCounter-1 && row == rowCounter-1)) {
					space = spaces[colCounter];
					
					var coveredCount = findNumber(space.classList);
					var updatedCount = parseInt(coveredCount)+1;			
					space.classList.remove(coveredCount);
					space.classList.add(updatedCount);
					
					// Different behavior if space covered by placed piece has a piece on it
					if (space.classList.contains("hasPieceOn")) {
						space.classList.add("covered");
						space.style.backgroundColor = document.getElementById("color-picker-coveredPiece").value; // background color
					}
					else {
						space.classList.add("covered");
						space.style.backgroundColor = document.getElementById("color-picker-covered").value; // background color
						space.classList.remove("free");
					}
				}
			}	
		} 
	}
	remove(row, col) {
		var board = document.getElementById("board");
		var rows = board.getElementsByTagName("tr");
		var spaces, space;
		var rowCounter, colCounter;
		for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
			spaces = rows[rowCounter].getElementsByTagName("td");
			
			for (colCounter = 1; colCounter < spaces.length; colCounter++) {
				if ((col == colCounter+1 && row == rowCounter+1) || 
					(col == colCounter+1 && row == rowCounter-1) || 
					(col == colCounter-1 && row == rowCounter+1) || 
					(col == colCounter-1 && row == rowCounter-1)) {
					space = spaces[colCounter];
										
					var coveredCount = findNumber(space.classList);
					var updatedCount = parseInt(coveredCount)-1;
					space.classList.remove(coveredCount);
					space.classList.add(updatedCount);

					if (updatedCount == 0) {
						// Different behavior if space covered by placed piece has a piece on it
						if (space.classList.contains("hasPieceOn")) {
							space.style.backgroundColor = document.getElementById("color-picker-pieceOn").value; // background color		
							space.classList.remove("covered");

						}
						else {
							space.classList.add("free");
							space.style.backgroundColor = document.getElementById("color-picker-free").value; // background color		
							space.classList.remove("covered");
						}
					}
				}
			}	
		} 
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

class KnightPiece {
	constructor() {
		this.name = "knight";
		this.icon = "♞";
	}
	place(row, col) {
		var board = document.getElementById("board");
		var rows = board.getElementsByTagName("tr");
		var spaces, space;
		var rowCounter, colCounter;
		for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
			spaces = rows[rowCounter].getElementsByTagName("td");
			
			for (colCounter = 1; colCounter < spaces.length; colCounter++) {
				if ((col == colCounter+1 && row == rowCounter+2) || 
					(col == colCounter+1 && row == rowCounter-2) || 
					(col == colCounter-1 && row == rowCounter+2) || 
					(col == colCounter-1 && row == rowCounter-2) || 
					(col == colCounter+2 && row == rowCounter+1) || 
					(col == colCounter+2 && row == rowCounter+1) || 
					(col == colCounter+2 && row == rowCounter-1) || 
					(col == colCounter-2 && row == rowCounter+1) || 
					(col == colCounter-2 && row == rowCounter-1)) {
					space = spaces[colCounter];
					
					var coveredCount = findNumber(space.classList);
					var updatedCount = parseInt(coveredCount)+1;			
					space.classList.remove(coveredCount);
					space.classList.add(updatedCount);
					
					// Different behavior if space covered by placed piece has a piece on it
					if (space.classList.contains("hasPieceOn")) {
						space.classList.add("covered");
						space.style.backgroundColor = document.getElementById("color-picker-coveredPiece").value; // background color
					}
					else {
						space.classList.add("covered");
						space.style.backgroundColor = document.getElementById("color-picker-covered").value; // background color
						space.classList.remove("free");
					}
				}
			}	
		} 
	}
	remove(row, col) {
			var board = document.getElementById("board");
			var rows = board.getElementsByTagName("tr");
			var spaces, space;
			var rowCounter, colCounter;
			for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
				spaces = rows[rowCounter].getElementsByTagName("td");
				
				for (colCounter = 1; colCounter < spaces.length; colCounter++) {
					if ((col == colCounter+1 && row == rowCounter+2) || 
						(col == colCounter+1 && row == rowCounter-2) || 
						(col == colCounter-1 && row == rowCounter+2) || 
						(col == colCounter-1 && row == rowCounter-2) || 
						(col == colCounter+2 && row == rowCounter+1) || 
						(col == colCounter+2 && row == rowCounter+1) || 
						(col == colCounter+2 && row == rowCounter-1) || 
						(col == colCounter-2 && row == rowCounter+1) || 
						(col == colCounter-2 && row == rowCounter-1)) {
						space = spaces[colCounter];
						
						var coveredCount = findNumber(space.classList);
						var updatedCount = parseInt(coveredCount)-1;
						space.classList.remove(coveredCount);
						space.classList.add(updatedCount);

						if (updatedCount == 0) {
							// Different behavior if space covered by placed piece has a piece on it
							if (space.classList.contains("hasPieceOn")) {
								space.style.backgroundColor = document.getElementById("color-picker-pieceOn").value; // background color		
								space.classList.remove("covered");

							}
							else {
								space.classList.add("free");
								space.style.backgroundColor = document.getElementById("color-picker-free").value; // background color		
								space.classList.remove("covered");
							}	
						}
					}
				}	
			} 
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

class BishopPiece {
	constructor() {
		this.name = "bishop";
		this.icon = "♝";
	}
	place(row, col) {
		var board = document.getElementById("board");
		var rows = board.getElementsByTagName("tr");
		var spaces, space;
		var rowCounter, colCounter;
		for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
			spaces = rows[rowCounter].getElementsByTagName("td");
			
			for (colCounter = 1; colCounter < spaces.length; colCounter++) {
				if (this.bishopPlacementCheck(row, col, rowCounter, colCounter, rows.length-1)) {
					space = spaces[colCounter];
					
					var coveredCount = findNumber(space.classList);
					var updatedCount = parseInt(coveredCount)+1;			
					space.classList.remove(coveredCount);
					space.classList.add(updatedCount);
					
					// Different behavior if space covered by placed piece has a piece on it
					if (space.classList.contains("hasPieceOn")) {
						space.classList.add("covered");
						space.style.backgroundColor = document.getElementById("color-picker-coveredPiece").value; // background color
					}
					else {
						space.classList.add("covered");
						space.style.backgroundColor = document.getElementById("color-picker-covered").value; // background color
						space.classList.remove("free");
					}
				}
			}	
		} 
	}
	remove(row, col) {
		var board = document.getElementById("board");
		var rows = board.getElementsByTagName("tr");
		var spaces, space;
		var rowCounter, colCounter;
		for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
			spaces = rows[rowCounter].getElementsByTagName("td");
			
			for (colCounter = 1; colCounter < spaces.length; colCounter++) {
				if (this.bishopPlacementCheck(row, col, rowCounter, colCounter, rows.length-1)) {
					space = spaces[colCounter];
					
					var coveredCount = findNumber(space.classList);
					var updatedCount = parseInt(coveredCount)-1;
					space.classList.remove(coveredCount);
					space.classList.add(updatedCount);

					if (updatedCount == 0) {
						// Different behavior if space covered by placed piece has a piece on it
						if (space.classList.contains("hasPieceOn")) {
							space.style.backgroundColor = document.getElementById("color-picker-pieceOn").value; // background color		
							space.classList.remove("covered");

						}
						else {
							space.classList.add("free");
							space.style.backgroundColor = document.getElementById("color-picker-free").value; // background color		
							space.classList.remove("covered");
						}	
					}
				}
			}	
		} 
	}
	bishopPlacementCheck(row, col, rowCounter, colCounter, n) {
		var i;
		for (i = 1; i < n; i++) {
			if ((row == rowCounter+i && col == colCounter+i) ||
				(row == rowCounter+i && col == colCounter-i) ||
				(row == rowCounter-i && col == colCounter+i) ||
				(row == rowCounter-i && col == colCounter-i)) {
					return true;
			}
		}
		return false;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

class RookPiece {
	constructor() {
		this.name = "rook";
		this.icon = "♜";
	}
	place(row, col) {
		var board = document.getElementById("board");
		var rows = board.getElementsByTagName("tr");
		var spaces, space;
		var rowCounter, colCounter;
		for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
			spaces = rows[rowCounter].getElementsByTagName("td");
			
			for (colCounter = 1; colCounter < spaces.length; colCounter++) {
				if (!(rowCounter == row && colCounter == col) && (col == colCounter || row == rowCounter)) {
					space = spaces[colCounter];
					
					var coveredCount = findNumber(space.classList);
					var updatedCount = parseInt(coveredCount)+1;			
					space.classList.remove(coveredCount);
					space.classList.add(updatedCount);
					
					// Different behavior if space covered by placed piece has a piece on it
					if (space.classList.contains("hasPieceOn")) {
						space.classList.add("covered");
						space.style.backgroundColor = document.getElementById("color-picker-coveredPiece").value; // background color
					}
					else {
						space.classList.add("covered");
						space.style.backgroundColor = document.getElementById("color-picker-covered").value; // background color
						space.classList.remove("free");
					}
				}
			}	
		} 
	}
	
	remove(row, col) {
		var board = document.getElementById("board");
		var rows = board.getElementsByTagName("tr");
		var spaces, space;
		var rowCounter, colCounter;
		for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
			spaces = rows[rowCounter].getElementsByTagName("td");
			
			for (colCounter = 1; colCounter < spaces.length; colCounter++) {
				if (!(rowCounter == row && colCounter == col) && (col == colCounter || row == rowCounter)) {
					space = spaces[colCounter];
					
					var coveredCount = findNumber(space.classList);
					var updatedCount = parseInt(coveredCount)-1;
					space.classList.remove(coveredCount);
					space.classList.add(updatedCount);

					if (updatedCount == 0) {
						// Different behavior if space covered by placed piece has a piece on it
						if (space.classList.contains("hasPieceOn")) {
							space.style.backgroundColor = document.getElementById("color-picker-pieceOn").value; // background color		
							space.classList.remove("covered");

						}
						else {
							space.classList.add("free");
							space.style.backgroundColor = document.getElementById("color-picker-free").value; // background color		
							space.classList.remove("covered");
						}	
					}
				}
			}	
		} 
	}	
}

//////////////////////////////////////////////////////////////////////////////////////////////////

class QueenPiece {
	constructor() {
		this.name = "queen";
		this.icon = "♛";
	}
	place(row, col) {
		var board = document.getElementById("board");
		var rows = board.getElementsByTagName("tr");
		var spaces, space;
		var rowCounter, colCounter;
		for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
			spaces = rows[rowCounter].getElementsByTagName("td");
			
			for (colCounter = 1; colCounter < spaces.length; colCounter++) {
				if ((!(rowCounter == row && colCounter == col) && (col == colCounter || row == rowCounter)) || (this.bishopPlacementCheck(row, col, rowCounter, colCounter, rows.length-1))) {
					space = spaces[colCounter];
					
					var coveredCount = findNumber(space.classList);
					var updatedCount = parseInt(coveredCount)+1;			
					space.classList.remove(coveredCount);
					space.classList.add(updatedCount);
					
					// Different behavior if space covered by placed piece has a piece on it
					if (space.classList.contains("hasPieceOn")) {
						space.classList.add("covered");
						space.style.backgroundColor = document.getElementById("color-picker-coveredPiece").value; // background color
					}
					else {
						space.classList.add("covered");
						space.style.backgroundColor = document.getElementById("color-picker-covered").value; // background color
						space.classList.remove("free");
					}
				}
			}	
		} 
	}
	remove(row, col) {
			var board = document.getElementById("board");
			var rows = board.getElementsByTagName("tr");
			var spaces, space;
			var rowCounter, colCounter;
			for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
				spaces = rows[rowCounter].getElementsByTagName("td");
				
				for (colCounter = 1; colCounter < spaces.length; colCounter++) {
					if ((!(rowCounter == row && colCounter == col) && (col == colCounter || row == rowCounter)) || (this.bishopPlacementCheck(row, col, rowCounter, colCounter, rows.length-1))) {
						space = spaces[colCounter];
						
						var coveredCount = findNumber(space.classList);
						var updatedCount = parseInt(coveredCount)-1;
						space.classList.remove(coveredCount);
						space.classList.add(updatedCount);

						if (updatedCount == 0) {
							// Different behavior if space covered by placed piece has a piece on it
							if (space.classList.contains("hasPieceOn")) {
								space.style.backgroundColor = document.getElementById("color-picker-pieceOn").value; // background color		
								space.classList.remove("covered");

							}
							else {
								space.classList.add("free");
								space.style.backgroundColor = document.getElementById("color-picker-free").value; // background color		
								space.classList.remove("covered");
							}	
						}
					}
				}	
			} 
		}

	bishopPlacementCheck(row, col, rowCounter, colCounter, n) {
		var i;
		for (i = 1; i < n; i++) {
			if ((row == rowCounter+i && col == colCounter+i) ||
				(row == rowCounter+i && col == colCounter-i) ||
				(row == rowCounter-i && col == colCounter+i) ||
				(row == rowCounter-i && col == colCounter-i)) {
					return true;
			}
		}
		return false;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

class KingPiece {
	constructor() {
		this.name = "king";
		this.icon = "♚";
	}
	place(row, col) {
		var board = document.getElementById("board");
		var rows = board.getElementsByTagName("tr");
		var spaces, space;
		var rowCounter, colCounter;
		for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
			spaces = rows[rowCounter].getElementsByTagName("td");
			
			for (colCounter = 1; colCounter < spaces.length; colCounter++) {			
				if (
					(col == colCounter && (row == rowCounter+1 || row == rowCounter-1)) || 
					((row == rowCounter) && (col == colCounter+1 || col == colCounter-1)) ||
					((row == rowCounter+1 || row == rowCounter-1) && (col == colCounter+1 || col == colCounter-1))) {
					space = spaces[colCounter];
					
					var coveredCount = findNumber(space.classList);
					var updatedCount = parseInt(coveredCount)+1;			
					space.classList.remove(coveredCount);
					space.classList.add(updatedCount);
					
					// Different behavior if space covered by placed piece has a piece on it
					if (space.classList.contains("hasPieceOn")) {
						space.classList.add("covered");
						space.style.backgroundColor = document.getElementById("color-picker-coveredPiece").value; // background color
					}
					else {
						space.classList.add("covered");
						space.style.backgroundColor = document.getElementById("color-picker-covered").value; // background color
						space.classList.remove("free");
					}
				}
			}	
		} 
	}
	remove(row, col) {
			var board = document.getElementById("board");
			var rows = board.getElementsByTagName("tr");
			var spaces, space;
			var rowCounter, colCounter;
			for (rowCounter = 1; rowCounter < rows.length; rowCounter++) {
				spaces = rows[rowCounter].getElementsByTagName("td");
				
				for (colCounter = 1; colCounter < spaces.length; colCounter++) {
					if (
						(col == colCounter && (row == rowCounter+1 || row == rowCounter-1)) || 
						((row == rowCounter) && (col == colCounter+1 || col == colCounter-1)) ||
						((row == rowCounter+1 || row == rowCounter-1) && (col == colCounter+1 || col == colCounter-1))) {
						space = spaces[colCounter];
						
						var coveredCount = findNumber(space.classList);
						var updatedCount = parseInt(coveredCount)-1;
						space.classList.remove(coveredCount);
						space.classList.add(updatedCount);

						if (updatedCount == 0) {
							// Different behavior if space covered by placed piece has a piece on it
							if (space.classList.contains("hasPieceOn")) {
								space.style.backgroundColor = document.getElementById("color-picker-pieceOn").value; // background color		
								space.classList.remove("covered");

							}
							else {
								space.classList.add("free");
								space.style.backgroundColor = document.getElementById("color-picker-free").value; // background color		
								space.classList.remove("covered");
							}	
						}
					}
				}	
			} 
		}
}

//////////////////////////////////////////////////////////////////////////////////////////////////



