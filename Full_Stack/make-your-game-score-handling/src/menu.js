// import TileMap from "./tileMap.js";
import {
    menuAction,
    gameOver,
    gameWin,
    submitButton,
    currentScore,
    onlyScoresData,
} from "./game.js";

let gameStarted = false;
// let isMenuOpen = false;

export default class Menu {
    constructor(tileSize) {
        this.tileSize = tileSize;
        this.menuBox = null;
        this.message = null;
    }

    setAll(gameStarted) {
        const gameContainer = document.getElementById("gameContainer");
        //const scoreBoardContainer = document.getElementById("scoreBoard");

        this.menuBox = document.createElement("div");
        this.menuBox.id = "menu";

        gameContainer.appendChild(this.menuBox);

        this.setMenuArea();
        this.changeMsg();

        if (!gameStarted) {
            this.createButton("start");
            //this.createButton("levels");
        } else if (!gameOver && !gameWin) {
            this.createButton("restart");
            this.createButton("continue");
            //this.createButton("levels");
        } else if (gameOver) {
            this.createButton("restart");
            //this.createButton("levels");
        } else if (gameWin) {
            this.showPercentile();
            this.createScoreSubmit();
            this.createButton("submit score");
            this.createButton("restart");
        }
    }

    showPercentile() {
        const percentileElem = document.createElement("p");
        percentileElem.id = "percentile";
        let percentile = this.calculatePercentile(onlyScoresData, currentScore);
        let suffix = this.getSuffix(percentile);
        let congrats = "";
        if (percentile >= 50) {
            congrats = "Congrats! ";
        }
        percentileElem.textContent = `${congrats}Your score is in the ${percentile}${suffix} percentile`;

        this.menuBox.appendChild(percentileElem);
    }

    getSuffix(number) {
        if (number > 3 && number < 21) return "th";
        switch (number % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    }

    calculatePercentile(array, v) {
        const sortedArray = array.sort((a, b) => a - b);
        if (typeof v !== "number") throw new TypeError("v must be a number");
        for (var i = 0, l = sortedArray.length; i < l; i++) {
            if (v <= sortedArray[i]) {
                while (i < l && v === sortedArray[i]) i++;
                if (i === 0) return 0;
                if (v !== sortedArray[i - 1]) {
                    i += (v - sortedArray[i - 1]) / (sortedArray[i] - sortedArray[i - 1]);
                }
                return Math.round((i / l) * 100);
            }
        }
        return 100;
    }

    createScoreSubmit() {
        const enterNameTextarea = document.createElement("textarea");
        enterNameTextarea.id = "enterName";
        enterNameTextarea.placeholder = "Enter your name";
        enterNameTextarea.setAttribute("maxlength", "12");

        this.menuBox.appendChild(enterNameTextarea);

        enterNameTextarea.addEventListener("input", submitButton);
    }

    changeMsg() {
        const textPara = document.createElement("p");

        textPara.id = "message";
        textPara.textContent = this.message;

        this.menuBox.appendChild(textPara);
    }

    openMenu(text) {
        this.message = text;
        if (!gameStarted) {
            this.setAll(gameStarted);
            gameStarted = true;
        } else {
            this.setAll(gameStarted);
        }
        this.menuBox.addEventListener("click", menuAction);
        document.getElementById("scoreboardContainer").style.display = "block";
        document.getElementById("fps").style.display = "none";
    }

    closeMenu() {
        this.menuBox.removeEventListener("click", menuAction);
        this.menuBox.remove();
        document.getElementById("scoreboardContainer").style.display = "none";
        document.getElementById("fps").style.display = "block";
    }

    createButton(name) {
        const button = document.createElement("button");
        button.classList = "menu-button";
        button.style.height = `${this.tileSize / 1}px`;
        button.style.width = `${this.tileSize * 6}px`;
        button.innerHTML = name;
        name = name.replaceAll(" ", "-");
        button.id = name;
        if (name === "submit-score") {
            button.setAttribute("disabled", "true");
        }

        this.menuBox.appendChild(button);
    }

    setMenuArea() {
        if (gameWin) {
            this.menuBox.style.width = `${7 * this.tileSize}px`;
            this.menuBox.style.height = `${9 * this.tileSize}px`;
        } else {
            this.menuBox.style.width = `${7 * this.tileSize}px`;
            this.menuBox.style.height = `${6 * this.tileSize}px`;
        }
    }
}
