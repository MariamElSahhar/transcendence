import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import * as TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";
import { SceneSky } from "../local-game/Scene/SceneSky.js";
import { PaddleBoundingBox } from "../local-game/Scene/PaddleBoundingBox.js";
import { Match } from "./Match.js";

export class Scene {
	#engine;
	#threeJSScene = new THREE.Scene();
	#match;
	#paddleBoundingBox;
	#matchHalfWidth = 20;
	#matchHalfHeight = 13.75;
	#cameraPadding = 10;
	#sky;
	#boardSize;
	#animationHeight = 20;

	constructor() {}

	async init(engine, playerNames, onMatchEndCallback) {
		this.#engine = engine;

		console.log("Cleaning up previous match...");
		this.cleanUp(); // Clear the previous match before initializing a new one

		try {
			console.log("Initializing match...");
			this.#match = new Match(
				"match_1",
				playerNames,
				1,
				onMatchEndCallback
			);
			await this.#match.init(engine);
			this.#threeJSScene.add(this.#match.threeJSGroup);
			console.log("Match initialized and added to scene.");

			// Initialize SceneSky
			this.#sky = new SceneSky();
			this.#threeJSScene.add(this.#sky.sky);
			this.setLightTheme();
			console.log("SceneSky initialized and light theme set.");

			// Add lights
			const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
			this.#threeJSScene.add(ambientLight);

			const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
			directionalLight.position.set(50, 100, 50);
			directionalLight.castShadow = true;
			this.#threeJSScene.add(directionalLight);

			// Ensure players are initialized
			const player = this.#match.players[0];
			if (!player || !player.board || !player.board.size) {
				throw new Error("Player board size is not defined.");
			}
			this.#boardSize = player.board.size;
			console.log("Player and board size initialized.");

			if (typeof PaddleBoundingBox === "function") {
				this.#paddleBoundingBox = new PaddleBoundingBox(
					this.#boardSize.y,
					player.paddle.size.y
				);
				console.log("PaddleBoundingBox initialized.");
			} else {
				throw new Error("PaddleBoundingBox is not defined.");
			}

			if (this.#engine.threeJS.controls) {
				this.#engine.threeJS.controls.target.set(30, 25, 0);
				console.log("Camera controls set.");
			} else {
				throw new Error("threeJS controls are not defined on engine.");
			}
		} catch (error) {
			console.error("Error during Scene initialization:", error);
			throw error;
		}
	}

	setLightTheme() {
		if (this.#sky) {
			this.#sky.setBrighterDay();
			console.log("Bright daylight theme applied in Scene.");
		}
	}

	setDarkTheme() {
		if (this.#sky) {
			this.#sky.setPolarNight();
			console.log("Twilight theme applied in Scene.");
		}
	}

	updateFrame(currentTime, timeDelta) {
		this.#match.updateFrame(
			timeDelta,
			currentTime,
			this.#paddleBoundingBox,
			this.#boardSize
		);
	}

	setPlayerPaddleDirection(direction, index) {
		this.#match.players[index].paddle.setDirection(direction);
	}

	updateCamera(animation = false) {
		const matchPosition = this.#match.threeJSGroup.position;
		const xHeight =
			(this.#matchHalfWidth + this.#cameraPadding * 0.5) /
			Math.tan(this.#engine.threeJS.getCameraHorizontalFOVRadian() * 0.5);
		const yHeight =
			(this.#matchHalfHeight + this.#cameraPadding * 0.5) /
			Math.tan(this.#engine.threeJS.getCameraVerticalFOVRadian() * 0.5);
		const cameraHeight =
			Math.max(xHeight, yHeight) - animation * this.#animationHeight;

		const cameraPosition = new THREE.Vector3(
			matchPosition.x,
			matchPosition.y,
			cameraHeight
		);
		const cameraLookAt = matchPosition.clone();
		this.#engine.updateCamera(cameraPosition, cameraLookAt);
	}

	resetMatch() {
		if (this.#match) {
			this.#match.resetMatch();
		}
		if (TWEEN.default && typeof TWEEN.default.removeAll === "function") {
			TWEEN.default.removeAll();
		}
	}
	cleanUp() {
		console.log("Cleaning up the scene...");

		// Iterate through each child and dispose of its resources
		while (this.#threeJSScene.children.length > 0) {
			const child = this.#threeJSScene.children[0];

			// Recursively remove and dispose of child objects
			this.disposeObject(child);

			this.#threeJSScene.remove(child);
		}

		// Clear TWEEN animations
		if (TWEEN.default && typeof TWEEN.default.removeAll === "function") {
			TWEEN.default.removeAll();
		}

		console.log("Scene cleaned up.");
	}

	// Helper method to dispose of an object and its children
	disposeObject(object) {
		if (!object) return;

		// Dispose of geometries
		if (object.geometry) {
			object.geometry.dispose();
		}

		// Dispose of materials
		if (object.material) {
			if (Array.isArray(object.material)) {
				object.material.forEach((material) => material.dispose());
			} else {
				object.material.dispose();
			}
		}

		// Dispose of textures
		if (object.material && object.material.map) {
			object.material.map.dispose();
		}

		// Recursively dispose of children
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
