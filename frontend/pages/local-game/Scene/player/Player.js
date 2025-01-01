import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { PongBoard } from "./PongBoard.js";
import { Paddle } from "./Paddle.js";

export class Player {
    #threeJSGroup = new THREE.Group();
    #board;
    #paddle;
    #isAIControlled;
    #isResetting = false;

    constructor(isAIControlled = false) {
        this.#isAIControlled = isAIControlled;
    }

    async init(index, pointsToWinMatch, playerName) {
        console.log(`Player.init called with index: ${index}, playerName: ${playerName}`);

        if (index === 0) {
            this.#threeJSGroup.position.set(-10, 0, 0);
        } else {
            this.#threeJSGroup.position.set(10, 0, 0);
        }

        this.#paddle = new Paddle(index === 1, this.#threeJSGroup.position, this.#isAIControlled);
        this.#threeJSGroup.add(this.#paddle.threeJSGroup);

        this.#board = new PongBoard();
        await this.#board.init(index, pointsToWinMatch, playerName);
        this.#threeJSGroup.add(this.#board.threeJSBoard);
    }

    updateFrame(timeDelta, pongGameBox, ballPosition = null) {
        this.#paddle.updateFrame(timeDelta, pongGameBox, ballPosition);
        this.#board.updateFrame();
    }

	resetPaddle() {
		if (this.#paddle && this.#board) {
			const boardSize = this.#board.size;
	
			const startingX = this.#threeJSGroup.position.x > 0
				? boardSize.x / 2 - 2 // Right player
				: -boardSize.x / 2 + 2; // Left player
			const startingY = 0;
			const startingZ = 0;
	
			this.#paddle.setPosition({ x: startingX, y: startingY, z: startingZ });
			this.#paddle.resetSize();
	
			console.log("Paddle reset to position and size:", {
				position: this.#paddle.getPosition(),
				size: this.#paddle.size,
			});
	
			// Force render after resetting paddle
			if (this.#threeJSGroup.parent && this.#threeJSGroup.parent instanceof THREE.Scene) {
				const scene = this.#threeJSGroup.parent;
				const renderer = scene.renderer; // Ensure the renderer is accessible
				if (renderer) {
					renderer.render(scene, scene.camera);
				}
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
        return this.#paddle;
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
        this.#paddle.changeSide();
        this.#board.changeSide();
    }
}
