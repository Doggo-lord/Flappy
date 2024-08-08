const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        bird.velocity = bird.lift;
    }
});

function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, pipe.top, pipe.width, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, pipe.bottomHeight);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        gameOver = true;
    } else if (bird.y < 0) {
        bird.y = 0;
        gameOver = true;
    }
}

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
        }

        if (
            (bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                bird.y < pipe.topHeight) ||
            (bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                bird.y + bird.height > pipe.bottom)
        ) {
            gameOver = true;
        }
    });
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", 60, 240);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    drawScore();
    updateBird();
    updatePipes();

    frame++;
    requestAnimationFrame(gameLoop);
}

gameLoop();
