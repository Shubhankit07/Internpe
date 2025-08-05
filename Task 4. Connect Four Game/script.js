document.addEventListener("DOMContentLoaded", () => {
  const ROWS = 6;
  const COLS = 7;
  let currentPlayer = "red";
  let gameBoard = [];
  let gameActive = true;

  const gameBoardElement = document.getElementById("game-board");
  const playerTurnElement = document.getElementById("player-turn");
  const restartButton = document.getElementById("restart-btn");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  const modalButton = document.getElementById("modal-btn");

  // Initialize the game
  function initGame() {
    gameBoard = Array(ROWS)
      .fill()
      .map(() => Array(COLS).fill(null));
    currentPlayer = "red";
    gameActive = true;

    updatePlayerTurnDisplay();
    renderGameBoard();
  }

  // Render the game board
  function renderGameBoard() {
    gameBoardElement.innerHTML = "";

    // Create columns (from top to bottom)
    for (let row = 0; row < ROWS; row++) {
      const rowElement = document.createElement("div");
      rowElement.classList.add("row");

      for (let col = 0; col < COLS; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        if (gameBoard[row][col]) {
          cell.classList.add(gameBoard[row][col]);
        }

        cell.dataset.row = row;
        cell.dataset.col = col;

        cell.addEventListener("click", handleCellClick);
        rowElement.appendChild(cell);
      }

      gameBoardElement.appendChild(rowElement);
    }
  }

  // Handle cell click
  function handleCellClick(e) {
    if (!gameActive) return;

    const col = parseInt(e.target.dataset.col);
    const row = findAvailableRow(col);

    if (row === -1) return; // Column is full

    gameBoard[row][col] = currentPlayer;
    renderGameBoard();

    if (checkWin(row, col)) {
      endGame(false);
      return;
    }

    if (checkDraw()) {
      endGame(true);
      return;
    }

    switchPlayer();
  }

  // Find the first available row in a column
  function findAvailableRow(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!gameBoard[row][col]) {
        return row;
      }
    }
    return -1;
  }

  // Switch players
  function switchPlayer() {
    currentPlayer = currentPlayer === "red" ? "yellow" : "red";
    updatePlayerTurnDisplay();
  }

  // Update player turn display
  function updatePlayerTurnDisplay() {
    const playerClass =
      currentPlayer === "red" ? "player-red" : "player-yellow";
    const playerName = currentPlayer === "red" ? "Player 1" : "Player 2";

    playerTurnElement.innerHTML = `<span class="${playerClass}">${playerName}</span>'s Turn`;
  }

  // Check for a win
  function checkWin(row, col) {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal down-right
      [1, -1], // diagonal down-left
    ];

    return directions.some(([dx, dy]) => {
      let count = 1;

      // Check in positive direction
      count += countDirection(row, col, dx, dy);
      // Check in negative direction
      count += countDirection(row, col, -dx, -dy);

      return count >= 4;
    });
  }

  // Count consecutive pieces in a direction
  function countDirection(row, col, dx, dy) {
    let r = row + dx;
    let c = col + dy;
    let count = 0;

    while (
      r >= 0 &&
      r < ROWS &&
      c >= 0 &&
      c < COLS &&
      gameBoard[r][c] === currentPlayer
    ) {
      count++;
      r += dx;
      c += dy;
    }

    return count;
  }

  // Check for a draw
  function checkDraw() {
    return gameBoard[0].every((cell) => cell !== null);
  }

  // End the game
  function endGame(isDraw) {
    gameActive = false;

    if (isDraw) {
      modalTitle.textContent = "Game Over!";
      modalMessage.textContent = "The game ended in a draw!";
    } else {
      const winner = currentPlayer === "red" ? "Player 1" : "Player 2";
      modalTitle.textContent = "Congratulations!";
      modalMessage.textContent = `${winner} wins the game!`;
    }

    modal.style.display = "flex";
  }

  // Event listeners
  restartButton.addEventListener("click", initGame);
  modalButton.addEventListener("click", () => {
    modal.style.display = "none";
    initGame();
  });

  // Start the game
  initGame();
});
