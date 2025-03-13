import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { PongBoard } from "./PongBoard.js";
import { Paddle } from "./Paddle.js";

export class Player {
    #threeJSGroup = new THREE.Group();
    #board;
    paddle;
    #isAIControlled;
    #gameStarted = false;

    constructor(isAIControlled = false) {
        this.#isAIControlled = isAIControlled;
    }

    async init(index, pointsToWinMatch, playerName) {
        if (index === 0) {
            this.#threeJSGroup.position.set(-10, 0, 0);
        } else {
            this.#threeJSGroup.position.set(10, 0, 0);
        }

        this.#board = new PongBoard();
        this.paddle = new Paddle(index === 1, this.#threeJSGroup.position, this.#isAIControlled);
        this.#threeJSGroup.add(this.paddle.threeJSGroup);

        await this.#board.init(index, pointsToWinMatch, playerName);
        this.#threeJSGroup.add(this.#board.threeJSBoard);
    }

    updateFrame(timeDelta, pongGameBox, ballPosition = null, gameStarted = false, movement) {
        if (!this.#gameStarted) return;

        this.paddle.updateFrame(timeDelta, pongGameBox, ballPosition, gameStarted, movement);
    }

    startGame() {
        this.#gameStarted = true;
    }

    stopGame() {
        this.#gameStarted = false;
    }

    resetPaddle() {
        if (this.paddle && this.#board) {
            const boardSize = this.#board.size;

            const startingX = this.#threeJSGroup.position.x > 0
                ? boardSize.x / 2 - 2
                : -boardSize.x / 2 + 2; 
            const startingY = 0;
            const startingZ = 0;

            this.paddle.setPosition({ x: startingX, y: startingY, z: startingZ });
            this.paddle.resetSize();

            if (this.#isAIControlled) {
                this.paddle.disableAIMovementTemporarily();
            }
        }
    }

    addPoint() {
        this.#board.addPoint();
        this.resetPaddle();
    }

    resetPoints() {
        this.#board.resetPoints();
    }

    get score() {
        return this.#board.score;
    }

    get threeJSGroup() {
        return this.#threeJSGroup;
    }

    get paddle() {
        return this.paddle;
    }

    get board() {
        return this.#board;
    }

    getPosition() {
        return this.#threeJSGroup.position;
    }

    changeSide() {
        this.#threeJSGroup.position.set(
            this.#threeJSGroup.position.x * -1,
            this.#threeJSGroup.position.y,
            this.#threeJSGroup.position.z
        );
        this.paddle.changeSide();
        this.#board.changeSide();
    }
}
