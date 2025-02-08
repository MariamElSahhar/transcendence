import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { Match } from "./Match.js";
import { PongGameBox } from "../local-game/Scene/PongGameBox.js";

export class Scene {
	#engine;
	#threeJSScene = new THREE.Scene();
	#match;
	#pongGameBox;
	#matchHalfWidth = 20.0;
	#matchHalfHeight = 13.75;
	#cameraPadding = 10.0;
	#boardSize;

	constructor() {}

	async init(engine, playerNames, onMatchEndCallback) {
		this.#engine = engine;
		this.cleanUp();

		try {
			this.#match = new Match(
				"match_1",
				playerNames,
				window.APP_CONFIG.pointsToWinPongMatch,
				onMatchEndCallback
			);
			await this.#match.init(engine);
			this.#threeJSScene.add(this.#match.threeJSGroup);

			const player = this.#match.players[0];
			if (!player || !player.board || !player.board.size) {
				throw new Error("Player board size is not defined.");
			}
			this.#boardSize = player.board.size;

			if (typeof PongGameBox === "function") {
				this.#pongGameBox = new PongGameBox(
					this.#boardSize.y,
					player.paddle.size.y
				);
			} else {
				throw new Error("PongGameBox is not defined.");
			}

			const textureLoader = new THREE.TextureLoader();
			const backgroundTexture = textureLoader.load(
				"/assets/textures/newmario.jpg",
				undefined,
				undefined,
				(error) =>
					console.error("Error loading background image:", error)
			);

			this.#threeJSScene.background = backgroundTexture;

			// Add lights
			const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
			this.#threeJSScene.add(ambientLight);

			const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
			directionalLight.position.set(50, 100, 50);
			this.#threeJSScene.add(directionalLight);

			// Adjust camera
			const camera = this.#engine.threeJS.getCamera();
			camera.position.set(0, 50, 100);
			camera.lookAt(0, 0, 0);

			if (this.#engine.threeJS.controls) {
				this.#engine.threeJS.controls.target.set(30, 25, 0);
			} else {
				throw new Error("threeJS controls are not defined on engine.");
			}
		} catch (error) {
			console.error("Error during Scene initialization:", error);
			throw error;
		}
	}

	setPlayerPaddleDirection(direction, index) {
		if (this.#match && this.#match.players[index]) {
			this.#match.players[index].paddle.setDirection(direction);
		} else {
			// console.error(`Player ${index} or match is not initialized.`);
		}
	}

	updateFrame(currentTime, timeDelta) {
		if (!this.#pongGameBox) {
			console.error("PongGameBox is not initialized.");
			return;
		}

		this.#match.updateFrame(
			timeDelta,
			currentTime,
			this.#pongGameBox,
			this.#boardSize
		);
	}

	updateCamera(animation = false) {
		const matchPosition = this.#match.threeJSGroup.position;
		const xHeight =
			(this.#matchHalfWidth + this.#cameraPadding * 0.5) /
			Math.tan(this.#engine.threeJS.getCameraHorizontalFOVRadian() * 0.5);
		const yHeight =
			(this.#matchHalfHeight + this.#cameraPadding * 0.5) /
			Math.tan(this.#engine.threeJS.getCameraVerticalFOVRadian() * 0.5);
		const cameraHeight = Math.max(xHeight, yHeight);

		const cameraPosition = new THREE.Vector3(
			matchPosition.x,
			matchPosition.y,
			cameraHeight
		);
		const cameraLookAt = matchPosition.clone();
		this.#engine.updateCamera(cameraPosition, cameraLookAt);
	}

	cleanUp() {
		while (this.#threeJSScene.children.length > 0) {
			const child = this.#threeJSScene.children[0];
			this.disposeObject(child);
			this.#threeJSScene.remove(child);
		}
	}

	disposeObject(object) {
		if (!object) return;

		if (object.geometry) object.geometry.dispose();
		if (object.material) {
			if (Array.isArray(object.material)) {
				object.material.forEach((material) => material.dispose());
			} else {
				object.material.dispose();
			}
		}
		if (object.material && object.material.map) {
			object.material.map.dispose();
		}
		if (object.children) {
			for (let i = object.children.length - 1; i >= 0; i--) {
				this.disposeObject(object.children[i]);
			}
		}
	}

	get match() {
		return this.#match;
	}

	get threeJSScene() {
		return this.#threeJSScene;
	}

	get boardSize() {
		return this.#boardSize;
	}
}
