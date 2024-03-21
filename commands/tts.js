const app = require('whatsapp-web.js')

module.exports = {
    name: 'Tic Tac Toe', // Command Name
    description: 'yeah', // Command Description
async execute(message, args, client){
    /// TODO: Implement a tic tac toe game where the winner is the first person to get 3 in a row.
// - Create a variable to keep track of whose turn it is.
// - Create variables for each player to prevent interruptions.
// - Read args to determine if a player wants to fight another player or the computer.
// - Implement an efficient computer player for tic tac toe.

    // Refactored TicTacToe class
            class TicTacToe {
              constructor() {
                this.currentPlayer = "X";
                this.playerX = "X";
                this.playerO = "O";
                this.board = [
                  ["", "", ""],
                  ["", "", ""],
                  ["", "", ""]
                ];
              }
          
              switchTurns() {
                this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
              }
          
              checkWinner() {
                const winningCombinations = [
                  [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal combinations
                  [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical combinations
                  [0, 4, 8], [2, 4, 6] // diagonal combinations
                ];
            
                for (let combination of winningCombinations) {
                  const [a, b, c] = combination;
                
                  if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                    return this.board[a];
                  }
                }
            
                return null;
              }
          
              playerMove(row, col) {
                if (this.isValidMove(row, col)) {
                  this.updateBoard(row, col, this.currentPlayer);
                  if (this.checkWinningMove(row, col)) {
                    this.handleWin();
                  } else {
                    this.switchTurns();
                  }
                } else {
                  console.log("Invalid move. Please try again.");
                }
              }
          
              isValidMove(row, col) {
                return this.board[row][col] === "";
              }
          
              updateBoard(row, col, symbol) {
                this.board[row][col] = symbol;
              }
          
              checkWinningMove(row, col) {
                const symbol = this.board[row][col];
                return (
                  this.checkHorizontal(row, symbol) ||
                  this.checkVertical(col, symbol) ||
                  this.checkDiagonal(row, col, symbol)
                );
              }
          
              handleWin() {
                console.log("You win!");
                this.resetGame();
              }
          
              checkHorizontal(row, symbol) {
                for (let col = 0; col < 3; col++) {
                  if (this.board[row][col] !== symbol) {
                    return false;
                  }
                }
                return true;
              }
          
              checkVertical(col, symbol) {
                for (let row = 0; row < 3; row++) {
                  if (this.board[row][col] !== symbol) {
                    return false;
                  }
                }
                return true;
              }
          
              checkDiagonal(row, col, symbol) {
                if (row !== col && row + col !== 2) {
                  return false;
                }
                let diagonal1 = true;
                let diagonal2 = true;
                for (let i = 0; i < 3; i++) {
                  if (this.board[i][i] !== symbol) {
                    diagonal1 = false;
                  }
                  if (this.board[i][2 - i] !== symbol) {
                    diagonal2 = false;
                  }
                }
                return diagonal1 || diagonal2;
              }
          
              resetGame() {
                this.board = Array.from(Array(3), () => Array(3).fill(""));
                this.currentPlayer = "X";
                console.log("Game reset.");
              }
          
              computerMove() {
                const emptyCells = this.getEmptyCells();
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                const randomCell = emptyCells[randomIndex];
                this.updateBoard(randomCell[0], randomCell[1], 'O');
                this.switchTurns();
              }
          
              getEmptyCells() {
                const emptyCells = [];
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (this.board[i][j] === '') {
                            emptyCells.push([i, j]);
                        }
                    }
                } return emptyCells;
              }
              displayBoard() {
                console.log("Current board:");
                for (let row of this.board) {
                  text += row.join(" | ");
                  client.sendMessage(message.from, text)
              }
            }
        }
    }
}