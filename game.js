// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 320;
canvas.height = 480;

// Bird object with properties
let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6, // Gravity effect
    lift: -8, // Lift effect when jumping
    velocity: 0,
};

// Pipe array to hold multiple pipes
let pipes = [];
let frame = 0;
let score = 0;
let highScore = 0;
let gameOver = false;

// Event listener for jumping
document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !gameOver) {
        bird.velocity = bird.lift;
    }
});

// Function to draw the bird
function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Function to draw the pipes
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, pipe.top, pipe.width, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, pipe.bottomHeight);
    });
}

// Function to update bird's position
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Check if bird hits the ground or goes above the screen
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        endGame();
    } else if (bird.y < 0) {
        bird.y = 0;
        endGame();
    }
}

// Function to update pipes' position and generate new pipes
function updatePipes() {
    if (frame % 100 === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height / 2));
        pipes.push({
            x: canvas.width,
            top: 0,
            topHeight: pipeHeight,
            bottom: pipeHeight + 80,
            bottomHeight: canvas.height - pipeHeight - 80,
            width: 20,
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            score++;
            if (score > highScore) {
                highScore = score;
            }
        }

        // Check for collision with pipes
        if (
            (bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                bird.y < pipe.topHeight) ||
            (bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                bird.y + bird.height > pipe.bottom)
        ) {
            endGame();
        }
    });
}

// Function to draw the score and high score
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
    ctx.fillText("High Score: " + highScore, 10, 50);
}

// Function to end the game
function endGame() {
    gameOver = true;
    document.getElementById("gameOverScreen").style.display = "flex";
    document.getElementById("finalScore").innerText = "Score: " + score;
}

// Function to reset the game
function tryAgain() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frame = 0;
    gameOver = false;
    document.getElementById("gameOverScreen").style.display = "none";
    gameLoop();
}

// Attach event listener to the Try Again button
document.getElementById("tryAgainButton").addEventListener("click", tryAgain);

// Main game loop
function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    drawScore();
    updateBird();
    updatePipes();

    frame++;
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
