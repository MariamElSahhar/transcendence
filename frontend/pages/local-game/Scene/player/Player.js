import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { _Board } from "./_Board.js";
import { Paddle } from "./Paddle.js";

export class Player {
	#threeJSGroup = new THREE.Group();
	#board;
	#paddle;
	#isAIControlled;

	constructor(isAIControlled = false) {
		this.#isAIControlled = isAIControlled;
	}

	async init(index, pointsToWinMatch) {
		if (index === 0) {
			this.#threeJSGroup.position.set(-10, 0, 0);
		} else {
			this.#threeJSGroup.position.set(10, 0, 0);
		}

		// Initialize paddle with AI control option
		this.#paddle = new Paddle(
			index,
			this.#threeJSGroup.position,
			this.#isAIControlled
		);
		this.#threeJSGroup.add(this.#paddle.threeJSGroup);

		// Initialize board
		this.#board = new _Board();
		await this.#board.init(index, pointsToWinMatch);
		this.#threeJSGroup.add(this.#board.threeJSBoard);
	}

	updateFrame(timeDelta, paddleBoundingBox, ballPosition = null) {
		// Update paddle, passing the ball position if AI-controlled
		this.#paddle.updateFrame(timeDelta, paddleBoundingBox, ballPosition);
		this.#board.updateFrame();
	}

	addPoint() {
		this.#board.addPoint();
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
