import TileMap from "./tileMap.js";
import Menu from "./menu.js";
import MapList from "./maps.js";


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

export const mapList = new MapList

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

const tileMap = new TileMap(tileSize);

let pacman = null;
let enemies = null;

let selectedLevel = 0;

let gameStarted = false;


menu.openMenu("Welcome<br>Please select a level<br>Current: " + selectedLevel);
isMenuOpen = true;

export function menuAction(event) {
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
                resetGame()
                menu.closeMenu();
                isMenuOpen = false;
                if (!gameStarted) {
                    gameStarted = true
                    start();
                }
                break;

            case "levels":
                menu.openLevels();
                break;

            case "main menu":
                menu.closeMenu();
                menu.shouldOpenMainMenu = true
                menu.openMenu("Welcome<br>Please select a level<br>Current: " + selectedLevel);
                break;

            default:
                break;
        }
    }
}

function selectMap() {
    tileMap.prevMap = [];
    tileMap.map = JSON.parse(JSON.stringify(mapList.maps[selectedLevel]));

    tileMap.powerDotCount = tileMap.map.flat().reduce((acc, num) => (num === 7 ? acc + 1 : acc), 0);
    tileMap.powerDotAnimationTimerDefault = 10 * tileMap.powerDotCount;
    tileMap.powerDotAnimationTimer = tileMap.powerDotAnimationTimerDefault;


    tileMap.setContainerSize(gameContainer);

    pacman = tileMap.getPacman(velocity);
    enemies = tileMap.getEnemies(velocity);
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
    if (pacman != null) { // basically when the game has been played once
        pacman.pacmanDiv.remove();
        const ghostDivs = document.querySelectorAll("div#ghost")
        ghostDivs.forEach(ghostDiv => {
            ghostDiv.remove()
        });
    }

    selectedLevel = menu.getLevel()
    selectMap()
}



document.addEventListener("keydown", pauseListener);

function pauseListener(event) {
    // 32 = space, 27 = esc
    //console.log(event.keyCode)
    if (event.keyCode === 32 || event.keyCode === 27) {
        if (!pressedPause && !isMenuOpen) {
            pressedPause = true;
            menu.openMenu("Paused");
            isMenuOpen = true;
        } else if (pressedPause) {
            pressedPause = false;
            menu.closeMenu();
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

// left commented until can test refresh rate
// var lastFrameTime = 0;
// var targetFPS = 60;
// var frameTime = targetFPS / 1000 // / targetFPS;

function gameLoop(timestamp) {
    // var elapsed = timestamp - lastFrameTime;

    // if (elapsed > frameTime) {
    //     lastFrameTime = timestamp;
    getFPS();
    tileMap.draw();
    drawGameEnd();
    pacman.draw(pause(), enemies);
    enemies.forEach((enemy) => enemy.draw(pause(), pacman));
    timer();
    checkGameover();
    checkGameWin();
    //  }
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

//tileMap.setContainerSize(gameContainer);

/** 10 for yellow dot, 100 for gost, 50 for powerdot*/
export function updateScore(scoreIncrease) {
    const score = document.getElementById("score");
    currentScore += scoreIncrease;
    score.innerHTML = `Score:<br>${currentScore}`;
}
