const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// GAME OBJECTS
const paddleWidth = 14, paddleHeight = 80, paddleMargin = 18;
const ballSize = 16;

const player = {
  x: paddleMargin,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0,
  score: 0
};

const computer = {
  x: canvas.width - paddleMargin - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 3,
  score: 0
};

const ball = {
  x: canvas.width / 2 - ballSize / 2,
  y: canvas.height / 2 - ballSize / 2,
  size: ballSize,
  speed: 6,
  dx: 6 * (Math.random() < 0.5 ? 1 : -1),
  dy: (Math.random() * 6 - 3)
};

// DRAW FUNCTIONS
function drawRect(x, y, w, h, color="#fff") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall() {
  ctx.fillStyle = "#fbff3a";
  ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function drawScore() {
  ctx.font = "40px Arial";
  ctx.fillStyle = "#f1f1f1";
  ctx.textAlign = "center";
  ctx.fillText(player.score, canvas.width/2 - 60, 50);
  ctx.fillText(computer.score, canvas.width/2 + 60, 50);
  // draw center line
  ctx.setLineDash([8, 16]);
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.strokeStyle = "#bbb5";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.setLineDash([]);
}

function resetBall() {
  ball.x = canvas.width / 2 - ball.size / 2;
  ball.y = canvas.height / 2 - ball.size / 2;
  ball.dx = ball.speed * (Math.random() < 0.5 ? 1 : -1);
  ball.dy = (Math.random() * 6 - 3);
  ball.speed = 6;
}

function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Top and bottom wall collision
  if (ball.y <= 0) {
    ball.y = 0;
    ball.dy *= -1;
  }
  if (ball.y + ball.size >= canvas.height) {
    ball.y = canvas.height - ball.size;
    ball.dy *= -1;
  }

  // Left paddle collision
  if (ball.x <= player.x + player.width &&
      ball.y + ball.size >= player.y &&
      ball.y <= player.y + player.height) {
    ball.x = player.x + player.width;
    ball.dx *= -1.1; // increase speed and direction
    ball.speed = Math.min(Math.abs(ball.dx), 20);
    ball.dy += player.dy * 0.3; // effect of paddle movement
  }

  // Computer paddle collision
  if (ball.x + ball.size >= computer.x &&
      ball.y + ball.size >= computer.y &&
      ball.y <= computer.y + computer.height) {
    ball.x = computer.x - ball.size;
    ball.dx *= -1.1;
    ball.speed = Math.min(Math.abs(ball.dx), 20);
    ball.dy += computer.dy * 0.3;
  }

  // Score conditions
  if (ball.x < 0) {
    computer.score++;
    resetBall();
  } else if (ball.x + ball.size > canvas.width) {
    player.score++;
    resetBall();
  }
}

function updateComputer() {
  // Move towards the ball
  let center = computer.y + computer.height / 2;
  if (ball.y + ball.size / 2 > center + 12) {
    computer.y += computer.dy;
  } else if (ball.y + ball.size / 2 < center - 12) {
    computer.y -= computer.dy;
  }
  // Clamp
  if (computer.y < 0) computer.y = 0;
  if (computer.y + computer.height > canvas.height) computer.y = canvas.height - computer.height;
}

// PLAYER CONTROLS
let mouseEnabled = true;
canvas.addEventListener("mousemove", function(e){
  if (!mouseEnabled) return;
  let rect = canvas.getBoundingClientRect();
  let scale = canvas.height / rect.height;
  player.y = (e.clientY - rect.top) * scale - player.height/2;
  // Clamp
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});

document.addEventListener("keydown", function(e) {
  mouseEnabled = false;
  if (e.key === "ArrowUp") player.dy = -6;
  else if (e.key === "ArrowDown") player.dy = 6;
});
document.addEventListener("keyup", function(e) {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") player.dy = 0;
});
function movePlayerByKeyboard() {
  player.y += player.dy;
  // Clamp
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// GAME LOOP
function gameLoop() {
  // Draw background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update
  movePlayerByKeyboard();
  updateComputer();
  updateBall();

  // Draw paddles, ball, score
  drawRect(player.x, player.y, player.width, player.height, "#30d0c7");
  drawRect(computer.x, computer.y, computer.width, computer.height, "#e34cbe");
  drawBall();
  drawScore();

  requestAnimationFrame(gameLoop);
}

resetBall();
gameLoop();
