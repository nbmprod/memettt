// game.js
class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
    }

    makeMove(position) {
        if (!this.board[position] && !this.gameOver) {
            this.board[position] = this.currentPlayer;
            if (this.checkWin()) {
                this.gameOver = true;
                return `${this.currentPlayer} wins!`;
            }
            if (this.board.every(cell => cell)) {
                this.gameOver = true;
                return 'It\'s a draw!';
            }
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            return this.getBoard();
        }
        return 'Invalid move';
    }

    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winPatterns.some(pattern => 
            this.board[pattern[0]] &&
            this.board[pattern[0]] === this.board[pattern[1]] &&
            this.board[pattern[1]] === this.board[pattern[2]]
        );
    }

    getBoard() {
        let formattedBoard = '';
        this.board.forEach((cell, index) => {
            formattedBoard += cell || '-';
            if ((index + 1) % 3 === 0) formattedBoard += '\n';
        });
        return formattedBoard;
    }

    reset() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
    }
}

module.exports = TicTacToe;
