import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { Match } from "./Match.js";
import { PongGameBox } from "./PongGameBox.js";
import { showError } from "../../error/ErrorPage.js";

export class Scene {
	#engine;
	#threeJSScene = new THREE.Scene();
	match = new Match();
	#pongGameBox;
	#matchHalfWidth = 20;
	#matchHalfHeight = 13.75;
	#cameraPadding = 20;
	#boardSize;

	constructor() {}

	async init(engine) {
		this.#engine = engine;

		try {
			await this.match.init(engine);
			this.#threeJSScene.add(this.match.threeJSGroup);

			// Set the camera position
			const camera = engine.threeJS.getCurrentCamera();
			camera.position.set(0, 50, 100);
			camera.lookAt(0, 0, 0);

			const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
			this.#threeJSScene.add(ambientLight);

			const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
			directionalLight.position.set(50, 100, 50);
			this.#threeJSScene.add(directionalLight);

			const player = this.match.players[0];
			if (!player) throw new Error("Player not initialized in match.");
			this.#boardSize = player.board.size;

			if (typeof PongGameBox === "function") {
				this.#pongGameBox = new PongGameBox(
					this.#boardSize.y,
					player.paddle.size.y
				);
			} else {
				throw new Error("PongGameBox is not defined.");
			}

			if (this.#engine.threeJS.controls) {
				this.#engine.threeJS.controls.target.set(30, 25, 0);
			} else {
				throw new Error("threeJS controls are not defined on engine.");
			}
		} catch (error) {
			showError();
			console.error("Error during Scene initialization:", error);
			throw error;
		}
	}

	updateFrame(currentTime, timeDelta) {
		this.match.updateFrame(
			timeDelta,
			currentTime,
			this.#pongGameBox,
			this.#boardSize
		);
	}

	startGame() {
		this.match.gameStarted = true;
	}

	setPaddleDirection(direction, index) {
		this.match.players[index].paddle.setDirection(direction);
	}
	updateCamera(animation = false) {
		const matchPosition = this.match.threeJSGroup.position;
		const horizontalFOV = this.#engine.threeJS.getHorizontalFOV();
		const verticalFOV = this.#engine.threeJS.getVerticalFOV();
		const xHeight =
			(this.#matchHalfWidth + this.#cameraPadding * 0.5) /
			Math.tan(horizontalFOV * 0.5);
		const yHeight =
			(this.#matchHalfHeight + this.#cameraPadding * 0.5) /
			Math.tan(verticalFOV * 0.5);
		const cameraHeight = Math.max(xHeight, yHeight);

		const cameraPosition = new THREE.Vector3(
			matchPosition.x,
			matchPosition.y,
			cameraHeight
		);
		const cameraLookAt = matchPosition.clone();
		this.#engine.updateCamera(cameraPosition, cameraLookAt);
	}

	get match() {
		return this.match;
	}

	get threeJSScene() {
		return this.#threeJSScene;
	}

	get boardSize() {
		return this.#boardSize;
	}
}
