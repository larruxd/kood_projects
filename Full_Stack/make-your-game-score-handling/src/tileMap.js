import Pacman from "./pacman.js";
import Enemy from "./ghosts.js";
import movingDirection from "./movingDirections.js";

export default class TileMap {
    constructor(tileSize) {
        this.tileSize = tileSize;

        this.yellowDot = new Image();
        this.yellowDot.src = "../graphics/yellowDot.png";

        this.wall = new Image();
        this.wall.src = "../graphics/wall.png";

        this.blackSquare = new Image();
        this.blackSquare.src = "../graphics/blackSquare.png";

        this.pinkDot = new Image();
        this.pinkDot.src = "../graphics/pinkDot.png";

        this.powerDotCount = this.map.flat().reduce((acc, num) => (num === 7 ? acc + 1 : acc), 0);
        this.powerDotAnimationTimerDefault = 10 * this.powerDotCount;
        this.powerDot = this.pinkDot;
        this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;
    }

    // 0 = yellowDot
    // 1 = wall
    // 4 = pacman
    // 5 = emptyspace
    // 6 = ghost
    // 7 = power dot
    maps = [
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 6, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 0, 6, 1, 0, 1, 0, 1],
            [1, 6, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 7, 1, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 7, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 6, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 6, 1],
            [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
            [1, 7, 0, 6, 1, 0, 0, 0, 0, 0, 1, 6, 0, 7, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
            [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 6, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 6, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 4, 7, 7, 0, 0, 0, 6, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
    ];

    map = this.maps[1];

    setContainerSize() {
        const container = document.getElementById("gameContainer");

        container.style.width = `${this.map[0].length * this.tileSize}px`;
        container.style.height = `${this.map.length * this.tileSize}px`;
    }

    prevMap = [];
    draw() {
        for (let row = 0; row < this.map.length; row++) {
            for (let col = 0; col < this.map[row].length; col++) {
                if (this.prevMap.length > 0) {
                    if (this.prevMap[row][col] !== this.map[row][col]) {
                        //console.log("prevmap !== map");
                        const tile = document.getElementById(`${row},${col}`);
                        const tileImg = tile.getElementsByTagName("img")[0];
                        if (tile) {
                            if (this.map[row][col] === 0) {
                                tileImg.src = this.yellowDot.src;
                            } else if (this.map[row][col] === 1) {
                                tileImg.src = this.wall.src;
                            } else if (this.map[row][col] === 5) {
                                tileImg.src = this.blackSquare.src;
                            } else if (this.map[row][col] === 7) {
                                tileImg.src = this.powerDot.src;
                            }
                        } else {
                            //console.log("prevmap === map");
                            const tile = document.createElement("div");
                            tile.id = `${row},${col}`;
                            tile.style.top = `${row * this.tileSize}px`;
                            tile.style.left = `${col * this.tileSize}px`;
                            tile.className = "tile";
                            if (this.map[row][col] === 0) {
                                tileImg.src = this.yellowDot.src;
                            } else if (this.map[row][col] === 1) {
                                tileImg.src = this.wall.src;
                            } else if (this.map[row][col] === 5) {
                                tileImg.src = this.blackSquare.src;
                            }
                            const container = document.getElementById("gameContainer");
                            container.appendChild(tile);
                        }
                    }
                } else {
                    //console.log("no prevmap");
                    const tile = document.createElement("div");
                    const tileImg = document.createElement("img");
                    tile.id = `${row},${col}`;
                    tile.style.top = `${row * this.tileSize}px`;
                    tile.style.left = `${col * this.tileSize}px`;
                    tile.className = "tile";
                    if (this.map[row][col] === 0) {
                        tileImg.src = this.yellowDot.src;
                    } else if (this.map[row][col] === 1) {
                        tileImg.src = this.wall.src;
                    } else if (this.map[row][col] === 5) {
                        tileImg.src = this.blackSquare.src;
                    } else if (this.map[row][col] === 7) {
                        tileImg.src = this.powerDot.src;
                    }
                    const container = document.getElementById("gameContainer");
                    tile.appendChild(tileImg);
                    container.appendChild(tile);
                }

                if (this.map[row][col] === 7) {
                    this.#powerDotBlink(row, col);
                }
            }
        }
        this.prevMap = this.map.map((innerArr) => innerArr.slice());
    }

    #powerDotBlink(row, col) {
        const tile = document.getElementById(`${row},${col}`);
        const tileImg = tile.getElementsByTagName("img")[0];
        this.powerDotAnimationTimer--;
        if (this.powerDotAnimationTimer === 0) {
            this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;
            if (this.powerDot === this.pinkDot) {
                this.powerDot = this.yellowDot;
            } else {
                this.powerDot = this.pinkDot;
            }
        }
        tileImg.src = this.powerDot.src;
    }

    getPacman(velocity) {
        for (let row = 0; row < this.map.length; row++) {
            for (let column = 0; column < this.map[row].length; column++) {
                let tile = this.map[row][column];
                if (tile === 4) {
                    this.map[row][column] = 0;
                    return new Pacman(
                        column * this.tileSize,
                        row * this.tileSize,
                        this.tileSize,
                        velocity,
                        this
                    );
                }
            }
        }
    }

    getEnemies(velocity) {
        const enemies = [];
        for (let row = 0; row < this.map.length; row++) {
            for (let col = 0; col < this.map[row].length; col++) {
                const tile = this.map[row][col];
                if (tile === 6) {
                    this.map[row][col] = 0;
                    enemies.push(
                        new Enemy(
                            col * this.tileSize,
                            row * this.tileSize,
                            this.tileSize,
                            velocity,
                            this
                        )
                    );
                }
            }
        }
        return enemies;
    }

    didCollideWithEnvironment(x, y, direction) {
        if (direction == null) {
            return;
        }

        if (Number.isInteger(x / this.tileSize) && Number.isInteger(y / this.tileSize)) {
            let row = 0;
            let col = 0;
            let nextRow = 0;
            let nextCol = 0;

            switch (direction) {
                case movingDirection.right:
                    nextCol = x + this.tileSize;
                    col = nextCol / this.tileSize;
                    row = y / this.tileSize;
                    break;
                case movingDirection.left:
                    nextCol = x - this.tileSize;
                    col = nextCol / this.tileSize;
                    row = y / this.tileSize;
                    break;
                case movingDirection.up:
                    nextRow = y - this.tileSize;
                    row = nextRow / this.tileSize;
                    col = x / this.tileSize;
                    break;
                case movingDirection.down:
                    nextRow = y + this.tileSize;
                    row = nextRow / this.tileSize;
                    col = x / this.tileSize;
                    break;
            }

            const tile = this.map[row][col];
            if (tile === 1) {
                return true;
            }
        }
        return false;
    }

    eatDot(x, y) {
        const row = y / this.tileSize;
        const col = x / this.tileSize;

        if (Number.isInteger(row) && Number.isInteger(col)) {
            if (this.map[row][col] === 0) {
                this.map[row][col] = 5;
                return true;
            }
        }
        return false;
    }
    eatPowerDot(x, y) {
        const row = y / this.tileSize;
        const col = x / this.tileSize;

        if (Number.isInteger(row) && Number.isInteger(col)) {
            if (this.map[row][col] === 7) {
                this.map[row][col] = 5;
                return true;
            }
        }
        return false;
    }

    didWin() {
        return this.#dotsLeft() === 0;
    }

    #dotsLeft() {
        return this.map.flat().filter((tile) => tile === 0 || tile === 7).length;
    }
}
