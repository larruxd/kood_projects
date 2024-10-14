import movingDirection from "./movingDirections.js";
import { updateScore, updateBossLives, volume, bossLives, isBossLevel } from "./game.js";

export default class Pacman {
    constructor(x, y, tileSize, velocity, tileMap) {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileMap = tileMap;

        this.currentDirection = null;
        this.requestedDirection = null;

        this.pacmanAniTimerDefault = 10;
        this.pacmanAniTimer = null;

        this.wakaSound = new Audio("../sounds/sounds_waka.wav");
        this.wakaSound.volume = volume;

        this.powerDotSound = new Audio("../sounds/sounds_power_dot.wav");
        this.powerDotSound.volume = volume;
        this.powerDotActive = false;
        this.powerDotAboutToExpire = false;
        this.timers = [];

        this.eatGhostSound = new Audio("../sounds/sounds_eat_ghost.wav");
        this.eatGhostSound.volume = volume;

        this.madeFirstMove = false;

        this.pacmanRotation = this.Rotation.right;

        this.collisionTimeoutTimerDefault = 100;
        this.collisionTimeoutTimer = 0;
        this.bossDead = false;

        document.addEventListener("keydown", this.#keydown);

        this.#loadPacmanImages();
    }

    Rotation = {
        right: 0,
        down: 1,
        left: 2,
        up: 3,
    };

    draw(pause, enemies, enemyBoss) {
        if (!pause) {
            this.#move();
            this.#animate();
        }

        this.#eatDot();
        this.#eatPowerDot();
        this.#eatGhost(enemies);
        if (isBossLevel) this.#eatBoss(enemyBoss);

        if (enemyBoss !== null && enemyBoss !== undefined) {
            this.#damageBoss(enemyBoss);
        }

        if (!this.pacmanDiv) {
            this.pacmanDiv = document.createElement("div");
            this.pacmanDiv.id = "pacman";
            this.pacmanDiv.style.width = `${this.tileSize}px`;
            this.pacmanDiv.style.height = `${this.tileSize}px`;
            this.pacmanDiv.style.backgroundSize = "contain";
            this.pacmanDiv.style.position = "absolute";
            document.getElementById("gameContainer").appendChild(this.pacmanDiv);
        }
        this.pacmanDiv.style.transform = `rotate(${this.pacmanRotation * 90}deg)`;
        this.pacmanDiv.style.backgroundImage = `url(${
            this.pacmanImages[this.pacmanImageIndex].src
        })`;
        this.pacmanDiv.style.left = `${this.x}px`;
        this.pacmanDiv.style.top = `${this.y}px`;
    }

    #loadPacmanImages() {
        const pacmanImage1 = new Image();
        pacmanImage1.src = "../graphics/pac0.png";

        const pacmanImage2 = new Image();
        pacmanImage2.src = "../graphics/pac1.png";

        const pacmanImage3 = new Image();
        pacmanImage3.src = "../graphics/pac2.png";

        // const pacmanImage4 = new Image();
        // pacmanImage4.src = "../graphics/pac1.png";

        this.pacmanImages = [pacmanImage1, pacmanImage2, pacmanImage3, pacmanImage2];

        this.pacmanImageIndex = 0;
    }

    #keydown = (event) => {
        //up
        if (event.keyCode == 38) {
            if (this.currentDirection == movingDirection.down)
                this.currentDirection = movingDirection.up;
            this.requestedDirection = movingDirection.up;
            this.madeFirstMove = true;
        }
        //down
        if (event.keyCode == 40) {
            if (this.currentDirection == movingDirection.up)
                this.currentDirection = movingDirection.down;
            this.requestedDirection = movingDirection.down;
            this.madeFirstMove = true;
        }
        //left
        if (event.keyCode == 37) {
            if (this.currentDirection == movingDirection.right)
                this.currentDirection = movingDirection.left;
            this.requestedDirection = movingDirection.left;
            this.madeFirstMove = true;
        }
        //right
        if (event.keyCode == 39) {
            if (this.currentDirection == movingDirection.left)
                this.currentDirection = movingDirection.right;
            this.requestedDirection = movingDirection.right;
            this.madeFirstMove = true;
        }
    };

    #move() {
        if (this.currentDirection !== this.requestedDirection) {
            if (
                Number.isInteger(this.x / this.tileSize) &&
                Number.isInteger(this.y / this.tileSize)
            ) {
                if (
                    !this.tileMap.didCollideWithEnvironment(this.x, this.y, this.requestedDirection)
                )
                    this.currentDirection = this.requestedDirection;
            }
        }

        if (this.tileMap.didCollideWithEnvironment(this.x, this.y, this.currentDirection)) {
            this.pacmanAniTimer = null;
            this.pacmanImageIndex = 1;
            return;
        } else if (this.currentDirection != null && this.pacmanAniTimer == null) {
            this.pacmanAniTimer = this.pacmanAniTimerDefault;
        }

        switch (this.currentDirection) {
            case movingDirection.up:
                this.y -= this.velocity;
                this.pacmanRotation = this.Rotation.up;
                break;
            case movingDirection.down:
                this.y += this.velocity;
                this.pacmanRotation = this.Rotation.down;

                break;
            case movingDirection.left:
                this.x -= this.velocity;
                this.pacmanRotation = this.Rotation.left;

                break;
            case movingDirection.right:
                this.x += this.velocity;
                this.pacmanRotation = this.Rotation.right;

                break;
        }
    }

    #animate() {
        if (this.pacmanAniTimer == null) {
            return;
        }
        this.pacmanAniTimer--;
        if (this.pacmanAniTimer == 0) {
            this.pacmanAniTimer = this.pacmanAniTimerDefault;
            this.pacmanImageIndex++;
            if (this.pacmanImageIndex == this.pacmanImages.length) this.pacmanImageIndex = 0;
        }
    }

    #eatDot() {
        if (this.tileMap.eatDot(this.x, this.y) && this.madeFirstMove) {
            this.wakaSound.play();
            updateScore(10);
        }
    }

    #eatPowerDot() {
        if (this.tileMap.eatPowerDot(this.x, this.y)) {
            this.powerDotSound.play();
            updateScore(50);
            this.powerDotActive = true;
            this.powerDotAboutToExpire = false;
            this.timers.forEach((timer) => clearTimeout(timer));
            this.timers = [];

            let powerDotTimer = setTimeout(() => {
                this.powerDotActive = false;
                this.powerDotAboutToExpire = false;
            }, 1000 * 6);

            this.timers.push(powerDotTimer);

            let powerDotAboutToExpireTimer = setTimeout(() => {
                this.powerDotAboutToExpire = true;
            }, 1000 * 3);

            this.timers.push(powerDotAboutToExpireTimer);
        }
    }

    #eatGhost(enemies) {
        if (this.powerDotActive) {
            const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
            collideEnemies.forEach((enemy) => {
                enemies.splice(enemies.indexOf(enemy), 1);
                enemy.ghostDiv.style.visibility = "hidden";
                this.eatGhostSound.play();
                updateScore(100);
            });
        }
    }

    #eatBoss(enemyBoss) {
        if (bossLives === 0 && !this.bossDead) {
            enemyBoss.ghostDiv.style.visibility = "hidden";
            this.eatGhostSound.play();
            updateScore(1000);
            this.bossDead = true;
        }
    }

    #damageBoss(enemyBoss) {
        if (this.collisionTimeoutTimer !== 0) {
            this.collisionTimeoutTimer--;
            if (!enemyBoss.bossInvincible) {
                console.log("boss invincible");
                enemyBoss.bossInvincible = true;
            }
        } else {
            if (enemyBoss.bossInvincible) {
                console.log("boss can take damage");
                enemyBoss.bossInvincible = false;
            }
        }
        if (this.powerDotActive) {
            if (enemyBoss.collideWith(this)) {
                if (this.collisionTimeoutTimer === 0) {
                    this.collisionTimeoutTimer = this.collisionTimeoutTimerDefault;
                    updateBossLives();
                }
            }
        }
    }
}
