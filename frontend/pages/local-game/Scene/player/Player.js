import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { PongBoard } from "./PongBoard.js";
import { Paddle } from "./Paddle.js";
import {sendWebSocketMessage} from "../../../../scripts/utils/websocket-manager.js"

export class Player {
    #threeJSGroup = new THREE.Group();
    #board;
    paddle;
    #isAIControlled;
    #gameStarted = false; // New flag to track game state

    constructor(isAIControlled = false, gameSession,gameType) {
        this.#isAIControlled = isAIControlled;
        this.gameSession=gameSession;
        this.gameType=gameType;
    }

    async init(index, pointsToWinMatch, playerName) {
        // console.log(`Player.init called with index: ${index}, playerName: ${playerName}`);

        if (index === 0) {
            this.#threeJSGroup.position.set(-10, 0, 0); // Left player
        } else {
            this.#threeJSGroup.position.set(10, 0, 0); // Right player
        }

        this.paddle = new Paddle(index === 1, this.#threeJSGroup.position, this.#isAIControlled,this.gameSession,this.gameType);
        this.#threeJSGroup.add(this.paddle.threeJSGroup);

        this.#board = new PongBoard();
        await this.#board.init(index, pointsToWinMatch, playerName);
        this.#threeJSGroup.add(this.#board.threeJSBoard);
    }

    updateFrame(timeDelta, pongGameBox, ballPosition = null, gameStarted = false) {
        if (!this.#gameStarted) return; // Prevent movement if the game hasn't started

        this.paddle.updateFrame(timeDelta, pongGameBox, ballPosition, gameStarted);
        this.#board.updateFrame();
    }

    startGame() {
        this.#gameStarted = true; // Allow paddle movement when the game starts
    }

    stopGame() {
        this.#gameStarted = false; // Stop paddle movement when the game ends
    }

    resetPaddle() {
        if (this.paddle && this.#board) {
            const boardSize = this.#board.size;

            const startingX = this.#threeJSGroup.position.x > 0
                ? boardSize.x / 2 - 2 // Right player
                : -boardSize.x / 2 + 2; // Left player
            const startingY = 0;
            const startingZ = 0;

            this.paddle.setPosition({ x: startingX, y: startingY, z: startingZ });
            this.paddle.resetSize();

            if (this.#isAIControlled) {
                this.paddle.disableAIMovementTemporarily();
            }

            // console.log("Paddle reset to position and size:", {
            //     position: this.paddle.getPosition(),
            //     size: this.paddle.size,
            // });
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
