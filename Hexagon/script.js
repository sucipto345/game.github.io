// Game state
let gameState = {
  players: [],
  currentPlayer: 0,
  board: [],
  players: [
    { name: '', score: 0, hexCount: 0, totalValue: 0 },
    { name: '', score: 0, hexCount: 0, totalValue: 0 }
],
  currentHexagon: null,
  gameOver: false,
  difficulty: ''
};

// Initialize the game
function initGame() {
  const gameInstructions = document.getElementById('game-instructions');
  const gameSetupForm = document.getElementById('game-setup');
  const player1NameInput = document.getElementById('player1-name');
  const player2NameInput = document.getElementById('player2-name');
  const opponentTypeSelect = document.getElementById('opponent-type');
  const difficultySelect = document.getElementById('difficulty');
  const startGameButton = document.getElementById('start-game');

  // Add game instructions
  addGameInstructions(gameInstructions);

  // Event listeners
  opponentTypeSelect.addEventListener('change', togglePlayer2Input);
  gameSetupForm.addEventListener('change', validateForm);
  gameSetupForm.addEventListener('submit', startGame);

  function togglePlayer2Input() {
      const player2Input = document.getElementById('player2-input');
      player2Input.style.display = opponentTypeSelect.value === 'player' ? 'flex' : 'none';
      validateForm();
  }

  function validateForm() {
      const isValid = player1NameInput.value.trim() !== '' &&
                      (opponentTypeSelect.value === 'bot' || player2NameInput.value.trim() !== '') &&
                      difficultySelect.value !== '';
      startGameButton.disabled = !isValid;
  }

  function startGame(e) {
      e.preventDefault();
      gameState.players = [
          { name: player1NameInput.value.trim(), score: 0 },
          { name: opponentTypeSelect.value === 'bot' ? 'Bot' : player2NameInput.value.trim(), score: 0 }
      ];
      gameState.difficulty = difficultySelect.value;
      
      // Hide welcome screen and show game screen
      document.getElementById('welcome-screen').style.display = 'none';
      document.getElementById('game-screen').style.display = 'block';
      
      // Initialize game board
      createBoard();
      initLeaderboard();
  }
}

function addGameInstructions(container) {
  const instructions = [
      "Hexaria is a multiplayer math puzzle game played on a hexagonal board.",
      "Players take turns placing numbered hexagons (1-20) on the board.",
      "You can take over opponent's hexagons by placing a higher value next to them.",
      "Adjacent hexagons of the same color add up their values.",
      "The player with the most points when the board is full wins!"
  ];

  const ul = document.createElement('ul');
  instructions.forEach(instruction => {
      const li = document.createElement('li');
      li.textContent = instruction;
      ul.appendChild(li);
  });

  container.appendChild(ul);

  // Animate instructions
  animateInstructions(ul.children);
}

function animateInstructions(instructionElements) {
  Array.from(instructionElements).forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.5s, transform 0.5s';
      
      setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
      }, index * 500);
  });
}

// Initialize the game
initGame();


// Create game board
function createBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = ''; // Clear existing board
  gameState.board = [];

  for (let i = 0; i < 8; i++) {
      const row = document.createElement('div');
      row.className = 'hex-row';
      gameState.board[i] = [];

      for (let j = 0; j < 10; j++) {
          const hexagon = document.createElement('div');
          hexagon.className = 'hexagon';
          hexagon.dataset.row = i;
          hexagon.dataset.col = j;
          hexagon.addEventListener('click', handleHexagonClick);
          hexagon.addEventListener('mouseover', handleHexagonHover);
          hexagon.addEventListener('mouseout', handleHexagonHoverOut);
          row.appendChild(hexagon);
          gameState.board[i][j] = { element: hexagon, value: null, color: null };
      }

      board.appendChild(row);
  }

  // Add disabled hexagons based on difficulty
  addDisabledHexagons();
}

function addDisabledHexagons() {
  let disabledCount;
  switch (gameState.difficulty) {
      case 'easy':
          disabledCount = 4;
          break;
      case 'medium':
          disabledCount = 6;
          break;
      case 'hard':
          disabledCount = 8;
          break;
  }

  for (let i = 0; i < disabledCount; i++) {
      let row, col;
      do {
          row = Math.floor(Math.random() * 8);
          col = Math.floor(Math.random() * 10);
      } while (gameState.board[row][col].element.classList.contains('disabled'));

      gameState.board[row][col].element.classList.add('disabled');
  }
}

// Handle hexagon click
function handleHexagonClick(event) {
  if (gameState.gameOver || gameState.players[gameState.currentPlayer].name === 'Bot') return;
  
  const hexagon = event.target;
  const row = parseInt(hexagon.dataset.row);
  const col = parseInt(hexagon.dataset.col);
  
  if (hexagon.classList.contains('disabled') || gameState.board[row][col].value !== null) return;
  
  placeHexagon(row, col);
  updateScores();
  
  if (checkGameOver()) {
      endGame();
  } else {
      nextTurn();
  }
}

function handleHexagonHover(event) {
  if (gameState.gameOver || gameState.players[gameState.currentPlayer].name === 'Bot') return;
  
  const hexagon = event.target;
  const row = parseInt(hexagon.dataset.row);
  const col = parseInt(hexagon.dataset.col);
  
  if (hexagon.classList.contains('disabled') || gameState.board[row][col].value !== null) return;
  
  // Show preview of current hexagon
  hexagon.textContent = gameState.currentHexagon.value;
  hexagon.classList.add(gameState.currentHexagon.color);
  hexagon.style.opacity = '0.7';
  
  // Show preview of potential takeovers
  showTakeoverPreview(row, col);
}



  function handleHexagonHoverOut(event) {
    if (gameState.gameOver || gameState.players[gameState.currentPlayer].name === 'Bot') return;
    
    const hexagon = event.target;
    const row = parseInt(hexagon.dataset.row);
    const col = parseInt(hexagon.dataset.col);
    
    if (hexagon.classList.contains('disabled') || gameState.board[row][col].value !== null) return;
    
    // Remove preview
    hexagon.textContent = '';
    hexagon.classList.remove('red', 'blue');
    hexagon.style.opacity = '';
    
    // Remove takeover preview
    removeTakeoverPreview();
}

function showTakeoverPreview(row, col) {
  const directions = [[-1, 0], [-1, 1], [0, 1], [1, 0], [1, -1], [0, -1]];
  const currentValue = gameState.currentHexagon.value;
  const currentColor = gameState.currentHexagon.color;

  directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      
      if (isValidPosition(newRow, newCol)) {
          const adjacentHexagon = gameState.board[newRow][newCol];
          if (adjacentHexagon.value !== null && adjacentHexagon.color !== currentColor && currentValue > adjacentHexagon.value) {
              adjacentHexagon.element.style.border = `3px solid ${currentColor}`;
          }
      }
  });
}

function removeTakeoverPreview() {
  gameState.board.forEach(row => {
      row.forEach(hexagon => {
          hexagon.element.style.border = '';
      });
  });
}


function placeHexagon(row, col) {
  const hexagon = gameState.board[row][col];
  hexagon.value = gameState.currentHexagon.value;
  hexagon.color = gameState.currentHexagon.color;
  hexagon.element.textContent = hexagon.value;
  hexagon.element.classList.add(hexagon.color);
  
  // Animate placement
  animatePlacement(hexagon.element);

  calculateScores();
  
  // Take over adjacent hexagons
  takeOverAdjacentHexagons(row, col);
  
  // Increment adjacent friendly hexagons
  incrementAdjacentFriendly(row, col);
}

function animatePlacement(element) {
  element.style.transform = 'scale(1.2)';
  setTimeout(() => {
      element.style.transform = 'scale(1)';
  }, 200);
}

function takeOverAdjacentHexagons(row, col) {
  const directions = [[-1, 0], [-1, 1], [0, 1], [1, 0], [1, -1], [0, -1]];
  const currentValue = gameState.board[row][col].value;
  const currentColor = gameState.board[row][col].color;

  directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 10) {
          const adjacentHexagon = gameState.board[newRow][newCol];
          if (adjacentHexagon.value !== null && adjacentHexagon.color !== currentColor && currentValue > adjacentHexagon.value) {
              adjacentHexagon.color = currentColor;
              adjacentHexagon.element.classList.remove('red', 'blue');
              adjacentHexagon.element.classList.add(currentColor);
          } else if (adjacentHexagon.color === currentColor) {
              adjacentHexagon.value += 1;
              adjacentHexagon.element.textContent = adjacentHexagon.value;
          }
      }
  });
}

function updateScores() {
  gameState.players[0].score = 0;
  gameState.players[1].score = 0;

  gameState.board.forEach(row => {
      row.forEach(hexagon => {
          if (hexagon.value !== null) {
              const playerIndex = hexagon.color === 'red' ? 0 : 1;
              gameState.players[playerIndex].score += hexagon.value;
          }
      });
  });

  document.getElementById('score1').textContent = gameState.players[0].score;
  document.getElementById('score2').textContent = gameState.players[1].score;
}

function endGame() {
  gameState.gameOver = true;
  calculateScores(); // Ensure final scores are calculated
  displayFinalScores();
  
  const winner = gameState.players[0].score > gameState.players[1].score ? gameState.players[0] : gameState.players[1];
  addToLeaderboard(winner);
  
  toggleLeaderboard(); // Show the leaderboard after the game ends
}

function nextTurn() {
  gameState.currentPlayer = 1 - gameState.currentPlayer;
  gameState.currentHexagon = generateRandomHexagon();
  updateCurrentHexagonDisplay();
  
  if (gameState.players[gameState.currentPlayer].name === 'Bot') {
      disablePlayerInput();
      simulateBotThinking();
  } else {
      enablePlayerInput();
  }
}

function disablePlayerInput() {
  document.querySelectorAll('.hexagon').forEach(hex => {
      hex.style.pointerEvents = 'none';
  });
}

function enablePlayerInput() {
  document.querySelectorAll('.hexagon').forEach(hex => {
      if (!hex.classList.contains('disabled') && !hex.textContent) {
          hex.style.pointerEvents = 'auto';
      }
  });
}

function simulateBotThinking() {
  let steps = 3;
  const thinkInterval = setInterval(() => {
      const randomHex = getRandomEmptyHexagon();
      if (randomHex) {
          highlightHexagon(randomHex);
      }
      steps--;
      if (steps === 0) {
          clearInterval(thinkInterval);
          setTimeout(botTurn, 500);
      }
  }, 500);
}

function highlightHexagon(hexagon) {
  hexagon.style.backgroundColor = '#ffff00';
  setTimeout(() => {
      hexagon.style.backgroundColor = '';
  }, 300);
}

function getRandomEmptyHexagon() {
  const emptyHexagons = document.querySelectorAll('.hexagon:not(.disabled):not(.red):not(.blue)');
  return emptyHexagons[Math.floor(Math.random() * emptyHexagons.length)];
}

function botTurn() {
  const bestMove = findBestMove();
  placeHexagon(bestMove.row, bestMove.col);
  updateScores();
  
  if (checkGameOver()) {
      endGame();
  } else {
      nextTurn();
  }
}

function findBestMove() {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 10; j++) {
          if (gameState.board[i][j].value === null && !gameState.board[i][j].element.classList.contains('disabled')) {
              const score = evaluateMove(i, j);
              if (score > bestScore) {
                  bestScore = score;
                  bestMove = { row: i, col: j };
              }
          }
      }
  }

  return bestMove;
}

function evaluateMove(row, col) {
  let score = 0;
  const currentValue = gameState.currentHexagon.value;
  const directions = [[-1, 0], [-1, 1], [0, 1], [1, 0], [1, -1], [0, -1]];

  // Check for takeovers
  directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 10) {
          const adjacentHexagon = gameState.board[newRow][newCol];
          if (adjacentHexagon.value !== null) {
              if (adjacentHexagon.color !== gameState.currentHexagon.color && currentValue > adjacentHexagon.value) {
                  score += adjacentHexagon.value * 2; // Prioritize takeovers
              } else if (adjacentHexagon.color === gameState.currentHexagon.color) {
                  score += 1; // Slightly prioritize placing next to own color
              }
          }
      }
  });

  // Prioritize center positions
  const distanceToCenter = Math.abs(row - 3.5) + Math.abs(col - 4.5);
  score += (7 - distanceToCenter) / 2;

  // Add some randomness to prevent predictable moves
  score += Math.random() * 2;

  return score;
}

function generateRandomHexagon() {
  return {
      value: Math.floor(Math.random() * 20) + 1,
      color: gameState.currentPlayer === 0 ? 'red' : 'blue'
  };
}

function updateCurrentHexagonDisplay() {
  const currentHexagonElement = document.getElementById('current-hexagon');
  currentHexagonElement.textContent = gameState.currentHexagon.value;
  currentHexagonElement.style.backgroundColor = gameState.currentHexagon.color;
}

function botTurn() {
  const availableHexagons = [];
  gameState.board.forEach((row, i) => {
      row.forEach((hexagon, j) => {
          if (hexagon.value === null && !hexagon.element.classList.contains('disabled')) {
              availableHexagons.push([i, j]);
          }
      });
  });

  if (availableHexagons.length > 0) {
      const [row, col] = availableHexagons[Math.floor(Math.random() * availableHexagons.length)];
      placeHexagon(row, col);
      updateScores();
      
      if (checkGameOver()) {
          endGame();
      } else {
          nextTurn();
      }
  }
}

function updateTurnDisplay() {
  const turnDisplay = document.getElementById('turn-display');
  turnDisplay.textContent = `${gameState.players[gameState.currentPlayer].name}'s Turn`;
  turnDisplay.style.color = gameState.currentPlayer === 0 ? 'red' : 'blue';
}

function nextTurn() {
  gameState.currentPlayer = 1 - gameState.currentPlayer;
  gameState.currentHexagon = generateRandomHexagon();
  updateCurrentHexagonDisplay();
  updateTurnDisplay();
  
  if (gameState.players[gameState.currentPlayer].name === 'Bot') {
      disablePlayerInput();
      simulateBotThinking();
  } else {
      enablePlayerInput();
  }
}

function takeOverAdjacentHexagons(row, col) {
  const directions = [[-1, 0], [-1, 1], [0, 1], [1, 0], [1, -1], [0, -1]];
  const currentValue = gameState.board[row][col].value;
  const currentColor = gameState.board[row][col].color;

  directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      
      if (isValidPosition(newRow, newCol)) {
          const adjacentHexagon = gameState.board[newRow][newCol];
          if (adjacentHexagon.value !== null && adjacentHexagon.color !== currentColor && currentValue > adjacentHexagon.value) {
              takeOverHexagon(adjacentHexagon, currentColor);
          }
      }
  });
}

function isValidPosition(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 10;
}

function takeOverHexagon(hexagon, newColor) {
  hexagon.color = newColor;
  hexagon.element.classList.remove('red', 'blue');
  hexagon.element.classList.add(newColor);
  
  // Animate takeover
  animateTakeover(hexagon.element);
}

function animateTakeover(element) {
  element.style.transform = 'rotate(360deg)';
  setTimeout(() => {
      element.style.transform = 'rotate(0deg)';
  }, 500);
}

function incrementAdjacentFriendly(row, col) {
  const directions = [[-1, 0], [-1, 1], [0, 1], [1, 0], [1, -1], [0, -1]];
  const currentColor = gameState.board[row][col].color;

  directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      
      if (isValidPosition(newRow, newCol)) {
          const adjacentHexagon = gameState.board[newRow][newCol];
          if (adjacentHexagon.color === currentColor) {
              incrementHexagonValue(adjacentHexagon);
          }
      }
  });
}

function incrementHexagonValue(hexagon) {
  hexagon.value += 1;
  hexagon.element.textContent = hexagon.value;
  
  // Animate increment
  animateIncrement(hexagon.element);
}

function animateIncrement(element) {
  element.style.transform = 'translateY(-10px)';
  setTimeout(() => {
      element.style.transform = 'translateY(0)';
  }, 200);
}

function updateScoreDisplay() {
  gameState.players.forEach((player, index) => {
      const scoreElement = document.getElementById(`score${index + 1}`);
      const detailsElement = document.getElementById(`player${index + 1}-details`);
      
      scoreElement.textContent = player.score;
      detailsElement.innerHTML = `
          Hexagons: ${player.hexCount}<br>
          Total Value: ${player.totalValue}
      `;
  });
}

function calculateScores() {
  gameState.players.forEach(player => {
      player.score = 0;
      player.hexCount = 0;
      player.totalValue = 0;
  });

  gameState.board.forEach(row => {
      row.forEach(hexagon => {
          if (hexagon.value !== null && !hexagon.element.classList.contains('disabled')) {
              const playerIndex = hexagon.color === 'red' ? 0 : 1;
              gameState.players[playerIndex].score += hexagon.value;
              gameState.players[playerIndex].hexCount += 1;
              gameState.players[playerIndex].totalValue += hexagon.value;
          }
      });
  });

  // Calculate bonus points
  gameState.players.forEach(player => {
      if (player.hexCount > 20) {
          player.score += Math.floor(player.hexCount / 5) * 10; // Bonus for controlling many hexagons
      }
      if (player.totalValue > 100) {
          player.score += Math.floor(player.totalValue / 50) * 5; // Bonus for high total value
      }
  });

  updateScoreDisplay();
}

function displayFinalScores() {
  const winner = gameState.players[0].score > gameState.players[1].score ? gameState.players[0] : gameState.players[1];
  const loser = gameState.players[0] === winner ? gameState.players[1] : gameState.players[0];

  alert(`Game Over!
  
Winner: ${winner.name}
Score: ${winner.score}
Hexagons: ${winner.hexCount}
Total Value: ${winner.totalValue}

Loser: ${loser.name}
Score: ${loser.score}
Hexagons: ${loser.hexCount}
Total Value: ${loser.totalValue}`);
}

function endGame() {
  gameState.gameOver = true;
  calculateScores(); // Ensure final scores are calculated
  displayFinalScores();
}

// Leaderboard functionality
let leaderboard = [];

function initLeaderboard() {
    const storedLeaderboard = localStorage.getItem('hexariaLeaderboard');
    if (storedLeaderboard) {
        leaderboard = JSON.parse(storedLeaderboard);
    }
    
    document.getElementById('sort-score').addEventListener('click', () => sortLeaderboard('score'));
    document.getElementById('sort-date').addEventListener('click', () => sortLeaderboard('date'));
    
    updateLeaderboardDisplay();
}

function addToLeaderboard(player) {
    const entry = {
        name: player.name,
        score: player.score,
        hexCount: player.hexCount,
        totalValue: player.totalValue,
        date: new Date().toISOString()
    };
    
    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score);
    
    if (leaderboard.length > 10) {
        leaderboard.pop();
    }
    
    localStorage.setItem('hexariaLeaderboard', JSON.stringify(leaderboard));
    updateLeaderboardDisplay();
}

function sortLeaderboard(criteria) {
    if (criteria === 'score') {
        leaderboard.sort((a, b) => b.score - a.score);
    } else if (criteria === 'date') {
        leaderboard.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    updateLeaderboardDisplay();
}

function updateLeaderboardDisplay() {
    const tbody = document.querySelector('#leaderboard-table tbody');
    tbody.innerHTML = '';
    
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${new Date(entry.date).toLocaleDateString()}</td>
            <td><button onclick="showDetails(${index})">Details</button></td>
        `;
        tbody.appendChild(row);
    });
}

function showDetails(index) {
    const entry = leaderboard[index];
    alert(`
        Name: ${entry.name}
        Score: ${entry.score}
        Hexagons: ${entry.hexCount}
        Total Value: ${entry.totalValue}
        Date: ${new Date(entry.date).toLocaleString()}
    `);
}

function toggleLeaderboard() {
    const leaderboardElement = document.getElementById('leaderboard');
    const gameScreenElement = document.getElementById('game-screen');
    
    if (leaderboardElement.style.display === 'none') {
      leaderboardElement.style.display = 'block';
      gameScreenElement.style.display = 'none';
    } else {
      leaderboardElement.style.display = 'none';
      gameScreenElement.style.display = 'block';
    }
}

// Initialize the game
initGame();