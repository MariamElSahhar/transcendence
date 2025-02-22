import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { ThreeJSUtils } from "../../scripts/game-utils/ThreeJSUtils.js";
import { KeyHandler } from "../../scripts/game-utils/KeyHandler.js";
import { Scene } from "./TournamentScene.js";

export class Engine {
	#threeJS;
	#keyHookHandler;
	#scene;
	#component;
	#onMatchEndCallback;
	playerNames;

	constructor(component, playerNames, onMatchEndCallback) {
		this.gameSession = -1;
		this.#component = component;
		this.playerNames = playerNames;
		this.#keyHookHandler = new KeyHandler(this);
		this.#scene = new Scene();
		this.#onMatchEndCallback = onMatchEndCallback;
	}

	async startGame() {
		console.log("engine starting game");
		if (!Array.isArray(this.playerNames) || this.playerNames.length < 2) {
			console.error("Invalid player names:", this.playerNames);
			return;
		}

		if (!this.#component || !this.#component.container) {
			console.error("Invalid component or container.");
			return;
		}
		if (this.#threeJS) {
			this.stopAnimationLoop();
			this.#threeJS.clearRenderer();
			this.#threeJS = null;
		}

		if (this.#scene) {
			this.clearScene(this.#scene.threeJSScene);
			this.#scene = null;
		}
		const container = this.#component.container;
		const canvas = container.querySelector("canvas");
		if (canvas) {
			container.removeChild(canvas);
		}

		this.#threeJS = new ThreeJSUtils(this);
		this.#keyHookHandler = new KeyHandler(this);

		this.#scene = new Scene();
		try {
			await this.#scene.init(
				this,
				this.playerNames,
				this.#onMatchEndCallback
			);
			this.#scene.updateCamera();
			this.startListeningForKeyHooks();
			this.displayGameScene();
		} catch (error) {
			console.error("Error initializing scene:", error);
			this.#scene = null;
		}
	}

	cleanUp() {
		try {
			this.stopAnimationLoop();
		} catch (err) {
			console.error("Error stopping animation loop:", err);
		}
		try {
			if (this.#keyHookHandler) {
				this.#keyHookHandler.stopListeningForKeys();
			}
		} catch (err) {
			console.error("Error stopping key hook handler:", err);
		}

		try {
			if (this.#scene) {
				this.clearScene(this.#scene.threeJSScene);
				// console.log("Scene cleared.");
			}
		} catch (err) {
			console.error("Error clearing the scene:", err);
		}
		try {
			if (this.#threeJS) {
				this.#threeJS.clearRenderer();
			}
		} catch (err) {
			console.error("Error clearing the renderer:", err);
		}
	}

	renderFrame() {
		this.#threeJS.renderFrame(this.#scene.threeJSScene);
	}

	get scene() {
		return this.#scene;
	}

	set scene(newScene) {
		this.clearScene(this.#scene.threeJSScene);
		this.#scene = newScene;
	}

	clearScene(scene) {
		while (scene.children.length > 0) {
			const child = scene.children[0];
			this.disposeObject(child);
			scene.remove(child);
		}
	}

	disposeObject(object) {
		if (!object) return;

		if (object.geometry) {
			object.geometry.dispose();
		}
		if (object.material) {
			if (Array.isArray(object.material)) {
				object.material.forEach((material) => {
					if (material.map) material.map.dispose();
					material.dispose();
				});
			} else {
				if (object.material.map) object.material.map.dispose();
				object.material.dispose();
			}
		}
		if (object.children) {
			for (let i = object.children.length - 1; i >= 0; i--) {
				this.disposeObject(object.children[i]);
			}
		}
	}

	setAnimationLoop(loopFunction) {
		this.#threeJS.setAnimationLoop(loopFunction);
	}

	stopAnimationLoop() {
		this.#threeJS.stopAnimationLoop();
	}

	displayGameScene() {
		const clock = new THREE.Clock();

		this.setAnimationLoop(() => {
			const currentTime = Date.now();
			const delta = clock.getDelta();
			this.scene.updateFrame(currentTime, delta);

			this.threeJS.updateControls();
			this.renderFrame();
		});
	}

	get component() {
		return this.#component;
	}

	get threeJS() {
		return this.#threeJS;
	}

	updateCamera(cameraPosition, cameraLookAt) {
		this.#threeJS.controls.target.set(
			cameraLookAt.x,
			cameraLookAt.y,
			cameraLookAt.z
		);
		this.#threeJS.setCameraPosition(cameraPosition);
		this.#threeJS.setCameraLookAt(cameraLookAt);
	}

	resizeHandler() {
		if (this.#scene instanceof Scene) {
			this.#scene.updateCamera();
		}
	}

	startListeningForKeyHooks() {
		this.#keyHookHandler.startListeningForKeys();
	}

	getComponent() {
		if (!this.#component) {
			console.error("Component is not defined.");
			return null;
		}
		return this.#component;
	}
}
