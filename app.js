document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('game-status');
    let currentPlayer = 'X';  // Player is 'X', Computer is 'O'
    let gameActive = true;
    let playerTurn = true;    // This flag controls if it's player's turn
    let gameState = ['', '', '', '', '', '', '', '', ''];

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-pos'));

        // Check if it's player's turn and the cell is empty
        if (!playerTurn || gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        makeMove(clickedCellIndex, 'X');
        if (checkForWinner('X')) return;

        playerTurn = false;  // Lock the player from making another move

        // Delay the computer move slightly for a more natural experience
        setTimeout(() => {
            computerMove();
        }, 500);
    }

    function makeMove(index, player) {
        const cell = document.querySelector(`[data-pos='${index}']`);
        
        // Clear the cell
        cell.textContent = '';
        
        // Assign the correct gif image
        if (player === 'X') {
            cell.innerHTML = '<img src="assets/chipi1.gif" alt="X" class="game-image">';
            document.getElementById('playerMoveSound').play();  // Play sound for player
            document.getElementById('computerMoveSound').pause();
        } else if (player === 'O') {
            cell.innerHTML = '<img src="assets/cat1.gif" alt="O" class="game-image">';
            document.getElementById('computerMoveSound').play();  // Play sound for computer
            document.getElementById('playerMoveSound').pause(); 
        }
    
        // Update game state
        gameState[index] = player;
    }    

    function checkForWinner(player) {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = gameState[winCondition[0]];
            const b = gameState[winCondition[1]];
            const c = gameState[winCondition[2]];
    
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c && a === player) {
                roundWon = true;
                break;
            }
        }
    
        if (roundWon) {
            stopAllMusic();
            if (player === 'X') {
                document.getElementById('winMusic').play();  // Player wins
            } else if (player === 'O') {
                document.getElementById('computerWinMusic').play();  // Computer wins
            }
            return true;
        }
        
        if (!gameState.includes('')) {
            stopAllMusic();
            document.getElementById('drawMusic').play();  // Play draw music
            return true;
        }

        return false;
    }
    
    function computerMove() {
        let availableMoves = gameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

        // Try to win or block first
        const bestMove = findBestMove();
        if (bestMove !== null) {
            makeMove(bestMove, 'O');
        } else {
            // Make a random move if no best move
            const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            makeMove(randomIndex, 'O');
        }

        if (!checkForWinner('O')) {
            playerTurn = true;  // Unlock the player to make the next move
        }
    }

    function findBestMove() {
        // Check if the computer can win or block
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const line = [gameState[a], gameState[b], gameState[c]];

            // Check if the computer can win
            if (line.filter(cell => cell === 'O').length === 2 && line.includes('')) {
                return [a, b, c].find(index => gameState[index] === '');
            }

            // Check if the player is about to win and block them
            if (line.filter(cell => cell === 'X').length === 2 && line.includes('')) {
                return [a, b, c].find(index => gameState[index] === '');
            }
        }

        // If no win or block move found, return null
        return null;
    }

    function stopAllMusic() {
        document.getElementById('winMusic').pause();
        document.getElementById('drawMusic').pause();
        document.getElementById('computerWinMusic').pause();
        document.getElementById('playerMoveSound').pause();
        document.getElementById('computerMoveSound').pause();
        
        
        // Reset music to the beginning
        document.getElementById('winMusic').currentTime = 0;
        document.getElementById('drawMusic').currentTime = 0;
        document.getElementById('computerWinMusic').currentTime = 0;
    }
    

    function restartGame() {
        currentPlayer = 'X';
        gameActive = true;
        playerTurn = true;  // Reset playerTurn to true at the beginning of a new game
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.textContent = '';
        board.forEach(cell => cell.textContent = '');
    }

    board.forEach(cell => cell.addEventListener('click', handleCellClick));

    // Telegram WebApp integration
    const tg = window.Telegram.WebApp;

    tg.expand(); // Expand the web app interface
    tg.MainButton.text = "Restart Game";
    tg.MainButton.show();

    tg.MainButton.onClick(() => {
        restartGame();
    });
});
