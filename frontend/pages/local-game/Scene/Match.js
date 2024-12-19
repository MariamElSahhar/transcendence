import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { Player } from "./player/Player.js";
import { Ball } from "./Ball.js";
import { addLocalGame } from "../../../scripts/clients/gamelog-client.js";

export class Match {
	#engine;

	#threeJSGroup = new THREE.Group();
	#players = [null, null];
	#ball;
	#ballIsWaiting;
	#ballStartTime;
	#pointsToWinMatch = 1;
	#matchIsOver = false;
	#points = [0, 0];

	constructor() {}

	async init(engine) {
		this.#engine = engine;
		console.log("ai enabled:", engine.isAIGame);
		// Initialize the ball
		this.#ball = new Ball();
		this.prepare_ball_for_match();
		this.#threeJSGroup.add(this.#ball.threeJSGroup);

		this.#threeJSGroup.position.set(30, 23.75, 0);

		// Initialize players, setting one as AI if specified
		for (let i = 0; i < 2; i++) {
			const isAIControlled = engine.isAIGame && i === 1; // Make the second player AI-controlled
			this.#players[i] = new Player(isAIControlled);
			await this.#players[i].init(i, this.#pointsToWinMatch);
			this.#threeJSGroup.add(this.#players[i].threeJSGroup);
		}
	}

	updateFrame(timeDelta, currentTime, paddleBoundingBox, boardSize) {
		const ballPosition = this.#ball.getPosition();

		// Update players' frames, passing the ball position for AI player
		this.#players[0].updateFrame(timeDelta, paddleBoundingBox);
		this.#players[1].updateFrame(
			timeDelta,
			paddleBoundingBox,
			ballPosition
		);

		if (!this.#matchIsOver) {
			if (this.#ballIsWaiting && currentTime >= this.#ballStartTime) {
				this.#ballIsWaiting = false;
			}
			if (!this.#ballIsWaiting) {
				this.#ball.updateFrame(timeDelta, boardSize, this);
			}
		}
	}

	prepare_ball_for_match() {
		this.#ballIsWaiting = true;
		this.#ballStartTime = Number(Date.now()) + 3000;
		this.#ball.prepareForMatch();
	}

	playerMarkedPoint(playerIndex) {
		this.#points[playerIndex]++;
		this.#players[playerIndex].addPoint();
		if (this.#points[playerIndex] >= this.#pointsToWinMatch) {
			this.endGame();
		} else this.prepare_ball_for_match();
	}

	async endGame() {
		this.#matchIsOver = true;
		this.#ball.removeBall();
		this.#engine.component.addEndGameCard(this.#points[0], this.#points[1]);
		const { success, error } = await addLocalGame({});
		if (error) console.error("Failed to save game to gamelog");
		return;
	}

	setBallMovement(movementJson) {
		this.#ball.setMovement(movementJson);
	}

	setBallPosition(positionJson) {
		this.#ball.setPosition(positionJson);
	}

	getPosition() {
		return this.#threeJSGroup.position;
	}

	get threeJSGroup() {
		return this.#threeJSGroup;
	}

	get players() {
		return this.#players;
	}

	get ball() {
		return this.#ball;
	}

	get ballStartTime() {
		return this.#ballStartTime;
	}
}
