import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import * as TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";

import { _ThreeJS } from "../utils/_ThreeJS.js";
import { _KeyHookHandler } from "../utils/_KeyHookHandler.js";
import { Scene } from "./Scene/Scene.js";

export class Engine {
	#threeJS;
	#keyHookHandler;
	#scene;
	#component;
	#isAIGame;

	constructor(component, isAIGame = false) {
		this.#component = component;
		this.#isAIGame = isAIGame;
		this.#threeJS = new _ThreeJS(this);
		this.#keyHookHandler = new _KeyHookHandler(this, this.#isAIGame);
		this.#scene = new Scene();
	}

	async startGame() {
		if (!this.#component.container) {
			console.error(
				"Container not found in component; delaying initialization."
			);
			return;
		}

		await this.#scene.init(this);
		if (this.#scene) {
			this.#scene.updateCamera();
			this.startListeningForKeyHooks();
			this.displayGameScene();
		} else {
			console.error("Scene initialization failed");
		}
	}

	cleanUp() {
		this.clearScene(this.#scene.threeJSScene);
		this.#threeJS.clearRenderer();
	}

	renderFrame() {
		this.#threeJS.renderFrame(this.#scene.threeJSScene);
	}

	get isAIGame() {
		return this.#isAIGame;
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
			this.clearScene(scene.children[0]);
			scene.remove(scene.children[0]);
		}
		if (scene.geometry) {
			scene.geometry.dispose();
		}
		if (scene.material) {
			scene.material.dispose();
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

			// Use TWEEN.update() or TWEEN.default.update()
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
}
