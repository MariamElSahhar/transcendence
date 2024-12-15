import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import * as TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";

import { _ThreeJS } from "../utils/_ThreeJS.js";
import { _KeyHookHandler } from "../utils/_KeyHookHandler.js";
import { Scene } from "./TournamentScene.js";

export class Engine {
	#threeJS;
	#keyHookHandler;
	#scene;
	#component;
	#onMatchEndCallback;

	constructor(component, onMatchEndCallback) {
		this.#component = component;
		this.#threeJS = new _ThreeJS(this);
		this.#keyHookHandler = new _KeyHookHandler(this);
		this.#scene = new Scene();
		this.#onMatchEndCallback = onMatchEndCallback;
	}
	async startGame(playerNames) {
		if (!this.#component || !this.#component.container) {
			console.error(
				"Container not found in component; delaying initialization."
			);
			return;
		}

		console.log(`Starting game with players: ${playerNames.join(" vs ")}`);

		// Clean up the previous engine if it exists
		if (this.#threeJS) {
			this.stopAnimationLoop();
			this.#threeJS.clearRenderer();
			this.#threeJS = null;
			console.log("Previous renderer cleared.");
		}

		if (this.#scene) {
			this.clearScene(this.#scene.threeJSScene);
			this.#scene = new Scene();
			console.log("Previous scene cleared.");
		}

		// Remove the previous canvas from the container
		const container = this.#component.container;
		const canvas = container.querySelector("canvas");
		if (canvas) {
			container.removeChild(canvas);
			console.log("Previous canvas removed from container.");
		}

		// Initialize new ThreeJS and KeyHookHandler
		this.#threeJS = new _ThreeJS(this);
		this.#keyHookHandler = new _KeyHookHandler(this);

		// Initialize the scene
		await this.#scene.init(this, playerNames, this.#onMatchEndCallback);

		if (this.#scene) {
			console.log("Scene initialized successfully.");
			this.#scene.updateCamera();
			this.startListeningForKeyHooks();
			this.displayGameScene();
		} else {
			console.error("Scene initialization failed");
		}
	}

	cleanUp() {
		console.log("Starting engine cleanup...");

		// Stop the animation loop
		try {
			this.stopAnimationLoop();
			console.log("Animation loop stopped.");
		} catch (err) {
			console.error("Error stopping animation loop:", err);
		}

		// Stop listening for key hooks
		try {
			if (this.#keyHookHandler) {
				this.#keyHookHandler.stopListeningForKeyHooks();
				console.log("Key hook handler stopped.");
			}
		} catch (err) {
			console.error("Error stopping key hook handler:", err);
		}

		// Clear the scene
		try {
			if (this.#scene) {
				this.clearScene(this.#scene.threeJSScene);
				console.log("Scene cleared.");
			}
		} catch (err) {
			console.error("Error clearing the scene:", err);
		}

		// Clear the renderer
		try {
			if (this.#threeJS) {
				this.#threeJS.clearRenderer();
				console.log("Renderer cleared.");
			}
		} catch (err) {
			console.error("Error clearing the renderer:", err);
		}

		console.log("Engine cleaned up successfully.");
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

	// Helper method to dispose of geometries, materials, and textures
	disposeObject(object) {
		if (!object) return;

		// Dispose geometries
		if (object.geometry) {
			object.geometry.dispose();
		}

		// Dispose materials and associated textures
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

		// Recursively dispose children
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

			// Update TWEEN animations
			if (TWEEN.update) {
				TWEEN.update();
			} else if (TWEEN.default && TWEEN.default.update) {
				TWEEN.default.update();
			}

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
		this.#keyHookHandler.startListeningForKeyHooks();
	}

	getComponent() {
		if (!this.#component) {
			console.error("Component is not defined.");
			return null;
		}
		return this.#component;
	}
}
