import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { ThreeJSUtils } from "../../scripts/game-utils/ThreeJSUtils.js";
import { KeyHandler } from "../../scripts/game-utils/KeyHandler.js";
import { Player } from "./Scene/player/Player.js";
import { Scene } from "./Scene/Scene.js";
import { showError } from "../error/ErrorPage.js";

export class Engine {
	#threeJS;
	keyHookHandler;
	scene;
	#component;
	#isAIGame;
	gameStarted = false;

	constructor(
		component,
		isAIGame = false,
		players,
		playerSide = "NA",
		gameSession = -1,
		sameSystem = "NA"
	) {
		this.#component = component;
		this.#isAIGame = isAIGame;
		this.playerSide = playerSide;
		this.gameSession = gameSession;
		this.players = players;
		this.sameSystem = sameSystem;
		this.#threeJS = new ThreeJSUtils(this);
		this.keyHookHandler = new KeyHandler(this, this.#isAIGame);
		this.scene = new Scene();
	}

	async createScene() {
		if (!this.#component.container) {
			showError();
			console.error(
				"Container not found in component; delaying initialization."
			);
			return;
		}

		if (!this.players || this.players.length < 2) {
			showError();
			console.error(
				"Players are not correctly initialized:",
				this.players
			);
			return;
		}

		const player1 = new Player(false);
		await player1.init(0, 3, this.players[0]);

		const player2 = new Player(this.#isAIGame);
		await player2.init(1, 3, this.players[1]);

		await this.scene.init(this, [player1, player2]);

		if (this.scene) {
			this.scene.updateCamera();
			this.displayGameScene();
		} else {
			showError();
			console.error("Scene initialization failed");
		}
	}

	startGame() {
		this.startListeningForKeyHooks();
		this.scene.startGame();
	}

	cleanUp() {
		if (this.scene) this.clearScene(this.scene.threeJSScene);
		this.stopAnimationLoop();
		this.#threeJS.disposeResources();
	}

	renderFrame() {
		this.#threeJS.renderScene(this.scene.threeJSScene);
	}

	get isAIGame() {
		return this.#isAIGame;
	}

	get scene() {
		return this.scene;
	}

	set scene(newScene) {
		this.clearScene(this.scene.threeJSScene);
		this.scene = newScene;
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
		this.#threeJS.startAnimationLoop(loopFunction);
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

			this.renderFrame();
			this.#threeJS.refreshControls();
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
		this.#threeJS.updateCameraPosition(cameraPosition);
		this.#threeJS.updateCameraLookAt(cameraLookAt);
	}

	resizeHandler() {
		if (this.scene instanceof Scene) {
			this.scene.updateCamera();
		}
	}

	startListeningForKeyHooks() {
		if (this.gameSession != -1)
			this.keyHookHandler.listenForKeys(
				"remote",
				this.playerSide,
				this.players,
				this.gameSession,
				this.sameSystem
			);
		else this.keyHookHandler.listenForKeys();
	}
}
