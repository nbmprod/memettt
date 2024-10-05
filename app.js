document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('game-status');
    let currentPlayer = 'X';
    let gameActive = true;
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

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        checkForWinner();
        switchPlayer();
    }

    function checkForWinner() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = gameState[winCondition[0]];
            const b = gameState[winCondition[1]];
            const c = gameState[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }

        if (!gameState.includes('')) {
            statusDisplay.textContent = "It's a draw!";
            gameActive = false;
            return;
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
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

    function restartGame() {
        currentPlayer = 'X';
        gameActive = true;
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.textContent = '';
        board.forEach(cell => cell.textContent = '');
    }
});
