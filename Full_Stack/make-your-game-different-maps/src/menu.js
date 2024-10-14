import { menuAction, gameOver, gameWin, mapList } from "./game.js"

let selectedLevel = 0;

export default class Menu {
    constructor(tileSize) {
        this.tileSize = tileSize
        this.menuBox = null
        this.levelBox = null
        this.messagePara = null
        this.shouldOpenMainMenu = true
    }


    setAll(message) {
        this.menuBox = document.createElement("div");
        this.menuBox.id = "menuBox";

        this.setMenuArea(4, 5, this.menuBox);
        this.addMsg(message, this.menuBox)

        if (this.shouldOpenMainMenu) {
            this.shouldOpenMainMenu = false
            this.createButton("start");
            this.createButton("levels");
        } else if (!gameOver && !gameWin) {
            this.createButton("restart");
            this.createButton("continue");
            this.createButton("main menu");
        } else if (gameOver || gameWin) {
            this.createButton("restart");
            this.createButton("main menu");
        }
        document.getElementById("gameContainer").appendChild(this.menuBox);
    }

    addMsg(message) {
        const textPara = document.createElement("p");

        textPara.id = "message";
        textPara.innerHTML = message;

        this.menuBox.appendChild(textPara);
        this.messagePara = textPara;
    }

    changeMsg(message) {
        this.messagePara.innerHTML = message;
    }

    openMenu(message) {
        this.setAll(message)
        this.menuBox.addEventListener("click", menuAction);
    }

    closeMenu() {
        this.menuBox.removeEventListener("click", menuAction)
        this.menuBox.remove();
    }

    openLevels() {
        this.levelBox = document.createElement("div");
        this.levelBox.id = "levelBox";
        this.setMenuArea(6, 6, this.levelBox);

        const textPara = document.createElement("p");

        textPara.id = "message";
        textPara.innerHTML = "Select a level";
        textPara.style.width = `${this.tileSize * 6}px`;

        this.levelBox.appendChild(textPara);

        const levelButtonsContainer = document.createElement("div");
        levelButtonsContainer.classList.add("level-buttons-container");

        mapList.maps.forEach((element, index) => {
            this.createLevelButton(index, levelButtonsContainer);
        });

        this.levelBox.appendChild(levelButtonsContainer);
        document.getElementById("gameContainer").appendChild(this.levelBox);
        this.levelBox.addEventListener("click", this.levelSelectListener.bind(this)); // Bind the function to the correct object context
    }

    levelSelectListener(event) {
        if (event.target.classList.contains("menu-button")) {
            selectedLevel = event.target.id.slice(6); // slice out the "level-" and get only the index

            this.levelBox.removeEventListener("click", this.levelSelectListener);
            this.levelBox.remove();
            this.changeMsg("Welcome<br>Please select a level<br>Current: " + selectedLevel);
        }
    }

    createLevelButton(name, target) {
        const button = document.createElement("button");
        button.id = "level-" + name; // "level-" is just for readability
        button.classList = "menu-button";
        button.style.height = `${this.tileSize / 1.5}px`;
        button.style.width = `${this.tileSize / 1.5}px`;
        button.innerHTML = name;

        target.appendChild(button);
    }

    createButton(name) {
        const button = document.createElement("button");
        button.id = name;
        button.classList = "menu-button";
        button.style.height = `${this.tileSize / 1.5}px`;
        button.style.width = `${this.tileSize * 3.5}px`;
        button.innerHTML = name;

        this.menuBox.appendChild(button);
    }

    setMenuArea(height, width, target) {
        target.style.height = `${this.tileSize * height}px`;
        target.style.width = `${width * this.tileSize}px`;
    }

    getLevel() {
        return selectedLevel;
    }
}
