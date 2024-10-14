import TileMap from "./tileMap.js";
import Menu from "./menu.js";

const tileSize = 32;
const velocity = 2;
let volume = 0.5; // maybe implement audio volume slider?
const gameContainer = document.getElementById("gameContainer");
const tileMap = new TileMap(tileSize);

// fps
const fpsContainer = document.getElementById("fps");
let fpsTotal = 0;
let fpsAverage = 0;
let frameCount = 0;
const fpsUpdateInterval = 10;
let fpsLimit = 90;
let lastTime = performance.now();

// timer
let startTime; // To store the timestamp when the game starts
let timerInterval;
let elapsedTime = 0;
let timerStarted = false;

//map and entities
const originalMap = JSON.parse(JSON.stringify(tileMap.map));
let pacman = tileMap.getPacman(velocity);
let enemies = tileMap.getEnemies(velocity);

// state
export let gameOver = false;
export let gameWin = false;

// sound
const gameOverSound = new Audio("../sounds/sounds_gameOver.wav");
gameOverSound.volume = 0.2;
const gameWinSound = new Audio("../sounds/sounds_gameWin.wav");
gameWinSound.volume = 0.2;

// menu
const menu = new Menu(tileSize);
let isMenuOpen = false;
let pressedPause = false;

// score
export let currentScore = 0;
let scoreBoardData = [];
export let onlyScoresData = [];
let currentPage = 1;
let numOfPages = 0;
document.addEventListener("DOMContentLoaded", getScores());

function getScores() {
    fetch("/GETscore")
        .then((response) => response.json())
        .then((scores) => {
            onlyScoresData = scores.map((score) => score.score);
            scoreBoardData = scores;
            numOfPages = Math.ceil(scoreBoardData.length / 5);
            displayScore(currentPage);
        });
}

function displayScore(page) {
    const tableBody = document.getElementById("scoreTableBody");
    const nextButton = document.getElementById("next");
    const previousButton = document.getElementById("previous");
    document.getElementById("pageNumber").innerHTML = `page ${currentPage}/${numOfPages}`;
    // clear scoreboard
    tableBody.innerHTML = "";
    const pageSize = 5;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const scoresPerPage = scoreBoardData.slice(start, end);

    if (scoresPerPage.length < 5 || scoreBoardData[page * 5] == undefined) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
    if (page == 1) {
        previousButton.disabled = true;
    } else {
        previousButton.disabled = false;
    }

    let row;
    let col;
    scoresPerPage.forEach((entry) => {
        row = document.createElement("tr");
        for (const [key, value] of Object.entries(entry)) {
            col = document.createElement("td");
            col.innerHTML = value;
            row.appendChild(col);
        }
        tableBody.appendChild(row);
    });
}

async function sendScores(name) {
    //console.log(name);
    const score = currentScore;
    const time = `${document.getElementById("minutes").innerHTML}:${
        document.getElementById("seconds").innerHTML
    }`;
    const data = { name, score, time };
    //console.log(data);
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    try {
        const response = await fetch("POSTscore", options);

        if (response.ok) {
            setTimeout(() => {
                getScores();
            }, 100);
        } else {
            console.error("Error sending score", response.statusText);
        }
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("previous")) {
        currentPage -= 1;
        getScores(currentPage);
    }
    if (e.target.classList.contains("next")) {
        currentPage += 1;
        getScores(currentPage);
    }
});

/* function previousPage() {
    if (currentPage > 1) {
        currentPage -= 1;
        getScores(currentPage);
    }
}

function nextPage() {
    currentPage += 1;
    getScores(currentPage);
} */

export function submitButton() {
    const textarea = document.getElementById("enterName");
    const submitBtn = document.getElementById("submit-score");

    if (textarea.value.trim() !== "") {
        submitBtn.removeAttribute("disabled");
    } else {
        submitBtn.setAttribute("disabled", "true");
    }
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
                menu.closeMenu();
                isMenuOpen = false;
                start();
                break;
            case "submit-score":
                const name = document.getElementById("enterName").value;
                if (name) {
                    sendScores(name);
                    document.getElementById("submit-score").remove();
                    document.getElementById("enterName").remove();
                    document.getElementById("percentile").remove();
                }

            default:
                break;
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

/* 10 for yellow dot, 100 for gost, 50 for powerdot */
export function updateScore(scoreIncrease) {
    const score = document.getElementById("score");
    currentScore += scoreIncrease;
    score.innerHTML = `Score:<br>${currentScore}`;
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

function start() {
    requestAnimationFrame(gameLoop);
}
