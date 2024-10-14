import TileMap from "./tileMap.js";
import Menu from "./menu.js";

const tileSize = 32;
const velocity = 2;
let volume = 0.5; // maybe implement audio volume slider?

const fpsContainer = document.getElementById("fps");
let fpsTotal = 0;
let fpsAverage = 0;
let frameCount = 0;
const fpsUpdateInterval = 10;
let fpsLimit = 90;
let lastTime = performance.now();

let startTime; // To store the timestamp when the game starts
let timerInterval;
let elapsedTime = 0;
let timerStarted = false;

const gameContainer = document.getElementById("gameContainer");
const tileMap = new TileMap(tileSize);

const originalMap = JSON.parse(JSON.stringify(tileMap.map));
let pacman = tileMap.getPacman(velocity);
let enemies = tileMap.getEnemies(velocity);

export let gameOver = false;
export let gameWin = false;
const gameOverSound = new Audio("../sounds/sounds_gameOver.wav");
gameOverSound.volume = 0.2;
const gameWinSound = new Audio("../sounds/sounds_gameWin.wav");
gameWinSound.volume = 0.2;

const menu = new Menu(tileSize);
let isMenuOpen = false;
let pressedPause = false;

let currentScore = 0;

function start() {
    requestAnimationFrame(gameLoop);
}

function getFPS() {
    const now = performance.now();
    fpsTotal += Math.round(1000 / (now - lastTime));
    lastTime = now;
    frameCount++;

    if (frameCount === fpsUpdateInterval) {
        fpsAverage = Math.round(fpsTotal / fpsUpdateInterval);
        fpsContainer.innerHTML = `FPS: ${fpsAverage}`;
        fpsTotal = 0;
        frameCount = 0;
    }
}

menu.openMenu("Welcome");
isMenuOpen = true;
// start();

document.addEventListener("keydown", pauseListener);

function pauseListener(event) {
    // 32 = space, 27 = esc
    if (event.keyCode === 32 || event.keyCode === 27) {
        if (!pressedPause && !isMenuOpen) {
            pressedPause = true;
            menu.openMenu("Paused");
            isMenuOpen = true;
        } else if (pressedPause) {
            pressedPause = false;
            menu.closeMenu("Paused");
            isMenuOpen = false;
        }
    }
}

// Function to update the Timer display
function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);

    // Update the timer display
    document.getElementById("minutes").textContent = padTime(minutes);
    document.getElementById("seconds").textContent = padTime(seconds);
}

function padTime(time) {
    return String(time).padStart(2, "0");
}

// Function to pause the Timer
function pauseTimer() {
    clearInterval(timerInterval);
}

// Function to stop the Timer
function stopTimer() {
    clearInterval(timerInterval);
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
}

function startTimer() {
    if (elapsedTime === 0) {
        startTime = Date.now();
    } else {
        startTime = Date.now() - elapsedTime;
    }

    timerInterval = setInterval(updateTimer, 1000); // Update every second
}

function timer() {
    if (pacman.madeFirstMove && !timerStarted && !pressedPause) {
        timerStarted = true;
        startTimer();
    } else if (pressedPause) {
        timerStarted = false;
        pauseTimer();
    } else if (gameOver || gameWin) {
        elapsedTime = 0;
        timerStarted = false;
        pauseTimer();
    }
}

function gameLoop() {
    getFPS();
    tileMap.draw();
    drawGameEnd();
    pacman.draw(pause(), enemies);
    enemies.forEach((enemy) => enemy.draw(pause(), pacman));
    timer();
    checkGameover();
    checkGameWin();
    requestAnimationFrame(gameLoop);
}

function checkGameover() {
    if (!gameOver) {
        gameOver = isGameOver();
        if (gameOver) {
            gameOverSound.play();
        }
    }
}

function checkGameWin() {
    if (!gameWin) {
        gameWin = tileMap.didWin();
        if (gameWin) {
            gameWinSound.play();
        }
    }
}

function isGameOver() {
    return enemies.some((enemy) => !pacman.powerDotActive && enemy.collideWith(pacman));
}

function pause() {
    return !pacman.madeFirstMove || gameOver || gameWin || pressedPause;
}

function drawGameEnd() {
    if ((gameWin || gameOver) && !isMenuOpen) {
        let text = " You Win!";
        if (gameOver) {
            text = " Get Good";
        }
        menu.openMenu(text);
        isMenuOpen = true;
    }
}

tileMap.setContainerSize(gameContainer);

export function menuListener() {
    const menuBox = document.getElementById("menu");
    menuBox.addEventListener("click", menuAction);

    function menuAction(event) {
        const button = event.target;
        // console.log(event.target)

        if (button.classList.contains("menu-button")) {
            const action = button.id;

            switch (action) {
                case "restart":
                    resetGame();
                    menu.closeMenu();
                    isMenuOpen = false;
                    break;

                case "continue":
                    pressedPause = false;
                    menu.closeMenu();
                    isMenuOpen = false;
                    break;

                case "start":
                    menu.closeMenu();
                    isMenuOpen = false;
                    start();
                    break;

                default:
                    break;
            }
        }
    }

}



function resetGame() {
    gameOver = false;
    gameWin = false;
    pressedPause = false;
    currentScore = 0;
    elapsedTime = 0;
    timerStarted = false;
    stopTimer();
    updateScore(0);

    document.querySelectorAll(".tile").forEach((tile) => {
        tile.remove();
    });

    tileMap.prevMap = [];
    tileMap.map = JSON.parse(JSON.stringify(originalMap));

    pacman.pacmanDiv.remove();
    enemies.forEach((enemy) => enemy.ghostDiv.remove());

    pacman = tileMap.getPacman(velocity);
    enemies = tileMap.getEnemies(velocity);
}

/** 10 for yellow dot, 100 for gost, 50 for powerdot*/
export function updateScore(scoreIncrease) {
    const score = document.getElementById("score");
    currentScore += scoreIncrease;
    score.innerHTML = `Score:<br>${currentScore}`;
}
