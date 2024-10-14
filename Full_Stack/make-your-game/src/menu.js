// import TileMap from "./tileMap.js";
import { menuListener, gameOver, gameWin } from "./game.js"

let gameStarted = false;
// let isMenuOpen = false;

export default class Menu {
    constructor(tileSize) {
        this.tileSize = tileSize

    }


    setAll(gameStarted) {
        const menuBox = document.createElement("div");
        menuBox.id = "menu";

        document.getElementById("gameContainer").appendChild(menuBox);

        setMenuArea(this.tileSize, menuBox);
        if (!gameStarted) {
            createButton(this.tileSize, menuBox, "start");
        } else if (!gameOver && !gameWin) {
            createButton(this.tileSize, menuBox, "restart");
            createButton(this.tileSize, menuBox, "continue");
        } else if (gameOver || gameWin) {
            createButton(this.tileSize, menuBox, "restart");
        }

    }

    changeMsg(text) {
        const menuBox = document.getElementById("menu");
        const textPara = document.createElement("p");

        textPara.id = "message";
        textPara.textContent = text;

        menuBox.appendChild(textPara);
    }

    openMenu(text) {
        if (!gameStarted) {
            this.setAll(gameStarted)
            gameStarted = true;
        } else {
            this.setAll(gameStarted)
        }
        this.changeMsg(text)
        menuListener()
    }

    closeMenu() {
        const menuBox = document.getElementById("menu")
        menuBox.remove();
    }

}

function setMenuArea(tileSize, menuBox) {
    menuBox.style.width = `${5 * tileSize}px`;
    menuBox.style.height = `${tileSize * 4}px`;
}

function createButton(tileSize, menuBox, name) {
    const button = document.createElement("button");
    button.id = name;
    button.classList = "menu-button";
    button.style.height = `${tileSize / 1.5}px`;
    button.style.width = `${tileSize * 3.5}px`;
    button.innerHTML = name;

    menuBox.appendChild(button);
}

