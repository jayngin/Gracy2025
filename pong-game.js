// Pong Game Implementation
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 15;
const BALL_SIZE = 8;
const PADDLE_SPEED = 6;
const INITIAL_BALL_SPEED = 4;
const MAX_BALL_SPEED = 8;
const WINNING_SCORE = 10;

// Game state
const game = {
    playerScore: 0,
    computerScore: 0,
    isGameRunning: false,
};

// Paddle object
const player = {
    x: 20,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
};

const computer = {
    x: canvas.width - PADDLE_WIDTH - 20,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
};

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED,
};

// Input handling
const keys = {
    ArrowUp: false,
    ArrowDown: false,
};

let mouseY = canvas.height / 2;

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = true;
    if (e.key === 'ArrowDown') keys.ArrowDown = true;
    if (!game.isGameRunning) {
        game.isGameRunning = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = false;
    if (e.key === 'ArrowDown') keys.ArrowDown = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
    if (!game.isGameRunning) {
        game.isGameRunning = true;
    }
});

// Update player paddle position
function updatePlayer() {
    // Mouse control
    player.y = mouseY - PADDLE_HEIGHT / 2;

    // Arrow key control (alternative)
    if (keys.ArrowUp) {
        player.y -= PADDLE_SPEED;
    }
    if (keys.ArrowDown) {
        player.y += PADDLE_SPEED;
    }

    // Boundary collision for player
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

// Update computer paddle position (AI)
function updateComputer() {
    const computerCenter = computer.y + computer.height / 2;
    const difficulty = 3; // Adjust for difficulty (higher = harder)

    if (computerCenter < ball.y - 35) {
        computer.y += PADDLE_SPEED * (difficulty / 3);
    } else if (computerCenter > ball.y + 35) {
        computer.y -= PADDLE_SPEED * (difficulty / 3);
    }

    // Boundary collision for computer
    if (computer.y < 0) {
        computer.y = 0;
    }
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom wall collision
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
        // Clamp ball position to prevent going out of bounds
        ball.y = Math.max(ball.size, Math.min(canvas.height - ball.size, ball.y));
    }

    // Player paddle collision
    if (
        ball.x - ball.size < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.size;

        // Add spin based on where ball hits paddle
        const deltaY = ball.y - (player.y + player.height / 2);
        ball.dy = deltaY * 0.1;

        // Increase ball speed slightly (up to max)
        ball.speed = Math.min(ball.speed + 0.3, MAX_BALL_SPEED);
        ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
    }

    // Computer paddle collision
    if (
        ball.x + ball.size > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.size;

        // Add spin based on where ball hits paddle
        const deltaY = ball.y - (computer.y + computer.height / 2);
        ball.dy = deltaY * 0.1;

        // Increase ball speed slightly (up to max)
        ball.speed = Math.min(ball.speed + 0.3, MAX_BALL_SPEED);
        ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
    }

    // Score points
    if (ball.x < 0) {
        game.computerScore++;
        resetBall();
    }
    if (ball.x > canvas.width) {
        game.playerScore++;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = INITIAL_BALL_SPEED;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * INITIAL_BALL_SPEED;
    ball.dy = (Math.random() - 0.5) * 2 * INITIAL_BALL_SPEED;
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;
}

function drawBall() {
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    drawCenterLine();

    // Draw paddles and ball
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();
}

// Update score display
function updateScoreDisplay() {
    document.getElementById('playerScore').textContent = game.playerScore;
    document.getElementById('computerScore').textContent = game.computerScore;
}

// Check for winner
function checkWinner() {
    if (game.playerScore >= WINNING_SCORE) {
        alert(`🎉 You Win! Final Score: ${game.playerScore} - ${game.computerScore}`);
        resetGame();
        return true;
    }
    if (game.computerScore >= WINNING_SCORE) {
        alert(`💻 Computer Wins! Final Score: ${game.playerScore} - ${game.computerScore}`);
        resetGame();
        return true;
    }
    return false;
}

// Reset game
function resetGame() {
    game.playerScore = 0;
    game.computerScore = 0;
    game.isGameRunning = false;
    resetBall();
    player.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    computer.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    updateScoreDisplay();
}

// Main game loop
function gameLoop() {
    if (game.isGameRunning) {
        updatePlayer();
        updateComputer();
        updateBall();
        updateScoreDisplay();
        checkWinner();
    }

    drawGame();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
