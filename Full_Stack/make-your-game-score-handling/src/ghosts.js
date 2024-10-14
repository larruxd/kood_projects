import movingDirection from "./movingDirections.js";

export default class Enemy {
    constructor(x, y, tileSize, velocity, tileMap) {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileMap = tileMap;

        this.#loadImg();

        this.movingDirection = Math.floor(Math.random() * Object.keys(movingDirection).length);
        this.directionTimerDefault = this.#random(10, 40);
        this.directionTimer = this.directionTimerDefault;

        this.scaredAboutToExpireTimerDefault = 10;
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
    }

    draw(pause, pacman) {
        if (!pause) {
            this.#move();
            this.#changeDirection();
        }
        this.#setImage(pacman);

        if (!this.ghostDiv) {
            this.ghostDiv = document.createElement("div");
            this.ghostDiv.id = "ghost";
            this.ghostDiv.style.width = `${this.tileSize}px`;
            this.ghostDiv.style.height = `${this.tileSize}px`;
            this.ghostDiv.style.backgroundSize = "contain";
            this.ghostDiv.style.position = "absolute";
            document.getElementById("gameContainer").appendChild(this.ghostDiv);
        }
        this.ghostDiv.style.backgroundImage = `url(${this.image.src})`;
        this.ghostDiv.style.left = `${this.x}px`;
        this.ghostDiv.style.top = `${this.y}px`;
    }

    collideWith(pacman) {
        const size = this.tileSize / 2;
        if (
            this.x < pacman.x + size &&
            this.x + size > pacman.x &&
            this.y < pacman.y + size &&
            this.y + size > pacman.y
        ) {
            return true;
        } else {
            return false;
        }
    }

    #setImage(pacman) {
        if (pacman.powerDotActive) {
            this.#setImagePowerDotActive(pacman);
        } else {
            this.image = this.normalGhost;
        }
    }
    #setImagePowerDotActive(pacman) {
        if (pacman.powerDotAboutToExpire) {
            //console.log("power dot about to expire");
            this.scaredAboutToExpireTimer--;
            if (this.scaredAboutToExpireTimer === 0) {
                this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
                if (this.image === this.scaredGhost) {
                    this.image = this.scaredGhost2;
                } else {
                    this.image = this.scaredGhost;
                }
            }
        } else {
            //console.log("power dot active");
            this.image = this.scaredGhost;
        }
    }

    #changeDirection() {
        //console.log(this.movingDirection);
        this.directionTimer--;
        let newMoveDirection = null;
        if (this.directionTimer == 0) {
            this.directionTimer = this.directionTimerDefault;
            newMoveDirection = Math.floor(Math.random() * Object.keys(movingDirection).length);
            //console.log(newMoveDirection);
        }

        if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
            if (
                Number.isInteger(this.x / this.tileSize) &&
                Number.isInteger(this.y / this.tileSize)
            ) {
                if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, newMoveDirection)) {
                    this.movingDirection = newMoveDirection;
                }
            }
        }
    }

    #move() {
        if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, this.movingDirection)) {
            switch (this.movingDirection) {
                case movingDirection.up:
                    this.y -= this.velocity;
                    break;
                case movingDirection.down:
                    this.y += this.velocity;
                    break;
                case movingDirection.left:
                    this.x -= this.velocity;
                    break;
                case movingDirection.right:
                    this.x += this.velocity;
                    break;
            }
        }
    }

    #random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    #loadImg() {
        this.normalGhost = new Image();
        this.normalGhost.src = "../graphics/ghost.png";

        this.scaredGhost = new Image();
        this.scaredGhost.src = "../graphics/scaredGhost.png";

        this.scaredGhost2 = new Image();
        this.scaredGhost2.src = "../graphics/scaredGhost2.png";

        this.image = this.normalGhost;
    }
}
