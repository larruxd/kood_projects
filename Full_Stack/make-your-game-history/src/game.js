import TileMap from "./tileMap.js";
import Menu from "./menu.js";
import MapList from "./maps.js";

const tileSize = 32;
const velocity = 2;
export let volume = 0.1; // maybe implement audio volume slider?

const fpsContainer = document.getElementById("fps");
let fpsTotal = 0;
let fpsAverage = 0;
let frameCount = 0;
const fpsUpdateInterval = 10;
let lastTime = performance.now();

let startTime; // To store the timestamp when the game starts
let timerInterval;
let elapsedTime = 0;
let timerStarted = false;

//const gameContainer = document.getElementById("gameContainer");

export const mapList = new MapList();

export let gameOver = false;
export let gameWin = false;
const gameOverSound = new Audio("../sounds/sounds_gameOver.wav");
gameOverSound.volume = volume;
const gameWinSound = new Audio("../sounds/sounds_gameWin.wav");
gameWinSound.volume = volume;

const menu = new Menu(tileSize);
let isMenuOpen = false;
let pressedPause = false;
//export let selectedLevel;

const bossLivesDefault = 4;
const bossVelocity = 4;
export let bossLives = bossLivesDefault;
export let isBossLevel = false;
let currentScore = 0;
let scoreOnLvlStart = 0;
let totalGhostsEaten = 0;
let ghostsEatenOnLvlStart = 0;
let bossLevelTrigger = 6;
let bossTakeDamage = new Audio("../sounds/sounds_damage_boss.wav");
bossTakeDamage.volume = volume;
let heartImage = new Image();
heartImage.src = "../graphics/heart.png";
let heartEmptyImage = new Image();
heartEmptyImage.src = "../graphics/heartEmpty.png";

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
let enemyBoss = null;

let gameStarted = false;

menu.openMenu("Welcome<br>Please select a level<br>Current: " + menu.selectedLevel);
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
                resetGame();
                menu.closeMenu();
                isMenuOpen = false;
                if (!gameStarted) {
                    gameStarted = true;
                    start();
                }
                break;

            case "levels":
                menu.openLevels();
                break;

            case "main menu":
                bossLives = bossLivesDefault;

                menu.selectedLevel = 0;
                scoreOnLvlStart = 0;
                ghostsEatenOnLvlStart = 0;
                totalGhostsEaten = 0;

                menu.isStoryMode = false;
                bossNotificationDisplayed = false;
                backstoryShown = false;

                menu.closeMenu();
                menu.shouldOpenMainMenu = true;
                menu.openMenu("Welcome<br>Please select a level<br>Current: " + menu.selectedLevel);
                break;

            case "next level":
                if (menu.isStoryMode) {
                    scoreOnLvlStart = currentScore;
                    ghostsEatenOnLvlStart = totalGhostsEaten;
                }
                if (menu.selectedLevel !== "boss") {
                    if (mapList.maps.length > menu.selectedLevel + 1) {
                        menu.selectedLevel += 1;
                    } else {
                        menu.selectedLevel = 0;
                    }
                }

                resetGame();
                menu.closeMenu();
                isMenuOpen = false;
                break;

            case "story":
                menu.isStoryMode = true;
                menu.selectedLevel = 0;
                resetGame();
                menu.closeMenu();
                isMenuOpen = false;
                if (!gameStarted) {
                    gameStarted = true;
                    start();
                }
                break;
            case "ok":
                menu.closeMenu();
                pressedPause = false;
                isMenuOpen = false;
                break;
            default:
                break;
        }
    }
}

function resetGame() {
    if (gameOver && menu.isStoryMode && menu.selectedLevel !== "boss") {
        bossNotificationDisplayed = false;
    }

    bossLives = bossLivesDefault;
    gameOver = false;
    gameWin = false;
    pressedPause = false;
    timerStarted = false;

    if (!menu.isStoryMode) {
        currentScore = 0;
        elapsedTime = 0;
    } else {
        currentScore = scoreOnLvlStart;
        totalGhostsEaten = ghostsEatenOnLvlStart;
    }
    if (document.getElementById("boss-lives") != undefined) {
        document.getElementById("boss-lives").remove();
    }

    stopTimer();
    updateScore(0);
    clearObjects();
    selectMap();
}

function clearObjects() {
    document.querySelectorAll(".tile").forEach((tile) => {
        tile.remove();
    });
    if (pacman != null) {
        // basically when the game has been played once
        pacman.pacmanDiv.remove();
        const ghostDivs = document.querySelectorAll("div#ghost");
        ghostDivs.forEach((ghostDiv) => {
            ghostDiv.remove();
        });
    }
}

function selectMap() {
    //console.log(menu.selectedLevel);
    tileMap.prevMap = [];
    if (menu.isStoryMode && totalGhostsEaten >= bossLevelTrigger) {
        menu.selectedLevel = "boss";
        tileMap.map = JSON.parse(JSON.stringify(mapList.bossMap));
    } else {
        tileMap.map = JSON.parse(JSON.stringify(mapList.maps[menu.selectedLevel]));
    }

    tileMap.powerDotCount = tileMap.map.flat().reduce((acc, num) => (num === 7 ? acc + 1 : acc), 0);
    tileMap.updatePowerDot();

    tileMap.setContainerSize(gameContainer);

    pacman = tileMap.getPacman(velocity);
    enemies = tileMap.getEnemies(velocity);
    if (menu.selectedLevel === "boss") {
        isBossLevel = true;
        enemyBoss = tileMap.getEnemyBoss(bossVelocity);
        generateHearts();
    }
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
    if (!menu.isStoryMode) {
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
    }
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
        if (!menu.isStoryMode) {
            elapsedTime = 0;
        }
        timerStarted = false;
        pauseTimer();
    }
}

// left commented until can test refresh rate
// var lastFrameTime = 0;
// var targetFPS = 60;
// var frameTime = targetFPS / 1000 // / targetFPS;

function checkGameover() {
    if (!gameOver) {
        gameOver = isGameOver();

        if (gameOver && !gameWin) {
            gameOverSound.play();
        }
    }
}

function checkGameWin() {
    if (!gameWin) {
        if (menu.selectedLevel == "boss") {
            gameWin = bossLives == 0;
        } else {
            gameWin = tileMap.didWin();
        }
        if (gameWin) {
            gameWinSound.play();
        }
    }
}

function isGameOver() {
    // is boss lvl
    if (menu.selectedLevel === "boss") {
        if (!pacman.powerDotActive && enemyBoss.collideWith(pacman)) {
            return true;
        }
        if (enemies.some((enemy) => !pacman.powerDotActive && enemy.collideWith(pacman))) {
            return true;
        }
        if (tileMap.map.flat().filter((tile) => tile === 7).length === 0 && !pacman.powerDotActive) {
            return true;
        }
    } else {
        // not boss lvl
        return enemies.some((enemy) => !pacman.powerDotActive && enemy.collideWith(pacman));
    }
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
    if (scoreIncrease === 100 && menu.isStoryMode) {
        totalGhostsEaten += 1;
    }
    const score = document.getElementById("score");
    currentScore += scoreIncrease;
    score.innerHTML = `Score:<br>${currentScore}`;
}

export function updateBossLives() {
    if (bossLives !== 0) {
        document.getElementById(`heart-${bossLives}`).src = heartEmptyImage.src;
        bossLives--;
        bossTakeDamage.play();
        console.log(bossLives);
    }
}

export function generateHearts() {
    const bossLivesDiv = document.createElement("div");
    bossLivesDiv.id = "boss-lives";
    for (let i = 1; i <= bossLivesDefault; i++) {
        let heartElem = document.createElement("img");
        heartElem.id = `heart-${i}`;
        heartElem.src = heartImage.src;

        bossLivesDiv.appendChild(heartElem);
        heartElem = null;
    }
    document.getElementById("backgroundTV").appendChild(bossLivesDiv);
}

let backstoryShown = false;
let bossNotificationDisplayed = false;

export let triggerMsg = "default";

function drawStoryMsg() {
    if (menu.isStoryMode) {
        if (totalGhostsEaten === bossLevelTrigger && !bossNotificationDisplayed) {//&& gameWin
            triggerMsg =
                "Behold, Pacman! Your ravenous appetite has stirred an ancient presence in the shadows. A formidable force awaits, watching, waiting...";
            menu.openMenu(triggerMsg);
            pressedPause = true;
            isMenuOpen = true;
            bossNotificationDisplayed = true;
        } else if (!backstoryShown) {
            triggerMsg =
                "Venture forth, brave Pacman! Consume enough ghosts (6) on your journey to challenge the legendary 'King Ghost' who lurks in the depths of the maze.";
            menu.openMenu(triggerMsg);
            pressedPause = true;
            isMenuOpen = true;
            backstoryShown = true;
        }
    }
}


var lastFrameTime = performance.now();
var targetFPS = 60;
var frameTime = 1000 / targetFPS; // / targetFPS;
var accumulatedTime = 0;

function gameLoop(timestamp) {
    // var currentFrameTime = performance.now();
    // var elapsed = currentFrameTime - lastFrameTime;
    // lastFrameTime = currentFrameTime;
    // accumulatedTime += elapsed;

    // if (accumulatedTime >= frameTime) {
    //     lastFrameTime = timestamp;

    getFPS();
    tileMap.draw();
    drawGameEnd();

    pacman.draw(pause(), enemies, enemyBoss);
    enemies.forEach((enemy) => enemy.draw(pause(), pacman));

    drawStoryMsg();

    // spawn boss only on specific lvl
    if (menu.selectedLevel === "boss" && enemyBoss !== null) {
        enemyBoss.draw(pause(), pacman);
    }

    timer();
    checkGameover();
    checkGameWin();
    // }
    // requestAnimationFrame(gameLoop);
    // setTimeout(() => {
    requestAnimationFrame(gameLoop);
    // }, 1000 / targetFPS);
}

