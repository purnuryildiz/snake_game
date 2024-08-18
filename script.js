//fonksiyonların tanımlandığı kısım:
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let setIntervalId;
let score = 0;

//Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

//Food un pozisyonunu değiştiren fonksiyon
const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1; // Rastgele X pozisyonu belirle (1-30 arası)
  foodY = Math.floor(Math.random() * 30) + 1; // Rastgele Y pozisyonu belirle (1-30 arası)
  initGame(); // Yeni pozisyon belirlendikten sonra oyunu başlat
};

const handleGameOver = () => {
  //clearing the timer and reloading the page on game over
  clearInterval(setIntervalId);
  alert("Game Over...");
  location.reload();
};

const changeDirection = (e) => {
  //changing velocity value based on key press
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
  initGame();
};

const initGame = () => {
  if (gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX};"></div>`;

  //checking if the snake hit the food

  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); //pushing food position to snake body array
    score++;

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);

    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];
  //Updating the snake's head position based on the current velocity
  snakeX += velocityX;
  snakeY += velocityY;
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]};"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[1][0]
    ) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = htmlMarkup;
};
changeFoodPosition();
setIntervalId = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection);
