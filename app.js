document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('game-status');
    const timerDisplay = document.getElementById('timer');
    let currentPlayer = 'X';  // Player is 'X', Computer is 'O'
    let gameActive = true;
    let playerTurn = true;    // This flag controls if it's player's turn
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let timer = null;  // Reference to the timer
    let timeLeft = 5;  // Initial time for the player's turn

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

    function startPlayerTimer() {
        timeLeft = 5;  // Reset the timer
        const timerBar = document.getElementById('timer-bar');
        
        // Reset the progress bar immediately without smooth transition
        timerBar.style.transition = 'none';  // Remove transition for immediate reset
        timerBar.style.width = '100%';  // Reset the bar to full width instantly
        
        // Add a small delay before shrinking with smooth transition
        setTimeout(() => {
            timerBar.style.transition = 'width 1s linear';  // Re-add smooth shrinking
        }, 0);
    
        // Start the timer countdown immediately
        timer = setInterval(() => {
            timeLeft--;
    
            // Ensure timeLeft is updated and the bar shrinks correctly
            if (timeLeft > 0) {
                const percentage = (timeLeft / 5) * 100;  // Calculate the percentage width
                timerBar.style.width = `${percentage}%`;  // Shrink the bar gradually
            }
    
            // When time is up, make the random move and reset the timer
            if (timeLeft <= 0) {
                clearInterval(timer);  // Stop the timer when it hits 0
                makeRandomMove();  // Automatically make a random move for the player
            }
    
        }, 1000);  // Update every second
    }
            
    function makeRandomMove() {
        // Find all available moves
        const availableMoves = gameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

        if (availableMoves.length > 0) {
            // Pick a random move from the available cells
            const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            makeMove(randomIndex, 'X');  // Make the player's move randomly

            if (!checkForWinner('X')) {
                playerTurn = false;
                setTimeout(() => {
                    computerMove();
                }, 1000);
            }
        }
    }

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-pos'));
    
        // Check if it's player's turn and the cell is empty
        if (!playerTurn || gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
    
        clearInterval(timer);  // Stop the timer since the player made a move
    
        makeMove(clickedCellIndex, 'X');
    
        // Immediately reset the progress bar after the player’s move
        const timerBar = document.getElementById('timer-bar');
        timerBar.style.transition = 'none';  // Disable the transition for instant reset
        timerBar.style.width = '100%';  // Set the width to 100% instantly
    
        if (checkForWinner('X')) return;
    
        playerTurn = false;  // Lock the player from making another move
    
        // Delay the computer move slightly for a more natural experience
        setTimeout(() => {
            computerMove();
        }, 1000);
    }

    function makeMove(index, player) {
        const cell = document.querySelector(`[data-pos='${index}']`);

        // Clear the cell and assign the correct gif image
        cell.textContent = '';
        if (player === 'X') {
            cell.innerHTML = '<img src="assets/chipi1.gif" alt="X" class="game-image">';
            document.getElementById('playerMoveSound').play();
        } else if (player === 'O') {
            cell.innerHTML = '<img src="assets/cat1.gif" alt="O" class="game-image">';
            document.getElementById('computerMoveSound').play();
        }

        gameState[index] = player;  // Update the game state
    }

    function checkForWinner(player) {
        let roundWon = false;
        let winningCells = [];

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
                winningCells = winCondition;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.textContent = `Player ${player} wins!`;
            gameActive = false;

            highlightWinningCells(winningCells);
            stopAllMusic();
            if (player === 'X') {
                document.getElementById('winMusic').play();
                statusDisplay.textContent = '😎😎😎';
            } else if (player === 'O') {
                document.getElementById('computerWinMusic').play();
                statusDisplay.textContent = '😭😭😭';
            }
            return true;
        }

        if (!gameState.includes('')) {
            statusDisplay.textContent = "It's a draw 🤔🤔🤔";
            stopAllMusic();
            document.getElementById('drawMusic').play();
            return true;
        }

        return false;
    }

    function highlightWinningCells(winningCells) {
        winningCells.forEach(index => {
            const cell = document.querySelector(`[data-pos='${index}']`);
            cell.classList.add('blinking');
        });
    }

    function computerMove() {
        const availableMoves = gameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

        const bestMove = findBestMove();
        if (bestMove !== null) {
            makeMove(bestMove, 'O');
        } else {
            const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            makeMove(randomIndex, 'O');
        }

        if (!checkForWinner('O')) {
            startPlayerTimer();  // Start the player's timer after the computer move
            playerTurn = true;
            
        }
    }

    function findBestMove() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const line = [gameState[a], gameState[b], gameState[c]];

            if (line.filter(cell => cell === 'O').length === 2 && line.includes('')) {
                return [a, b, c].find(index => gameState[index] === '');
            }

            if (line.filter(cell => cell === 'X').length === 2 && line.includes('')) {
                return [a, b, c].find(index => gameState[index] === '');
            }
        }

        return null;
    }

    function stopAllMusic() {
        document.getElementById('winMusic').pause();
        document.getElementById('drawMusic').pause();
        document.getElementById('computerWinMusic').pause();
        document.getElementById('playerMoveSound').pause();
        document.getElementById('computerMoveSound').pause();

        document.getElementById('winMusic').currentTime = 0;
        document.getElementById('drawMusic').currentTime = 0;
        document.getElementById('computerWinMusic').currentTime = 0;
    }

    function restartGame() {
        currentPlayer = 'X';
        gameActive = true;
        playerTurn = true;
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.textContent = 'memettt';
        clearInterval(timer);  // Stop the timer when the game restarts
    
        const timerBar = document.getElementById('timer-bar');
        timerBar.style.transition = 'none';  // Disable the transition for instant reset
        timerBar.style.width = '100%';  // Reset the bar to full width immediately
    
        stopAllMusic();
        board.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('blinking');
        });
    }
        
    board.forEach(cell => cell.addEventListener('click', handleCellClick));

    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.MainButton.text = "Restart Game";
    tg.MainButton.show();

    tg.MainButton.onClick(() => {
        restartGame();
    });
});
