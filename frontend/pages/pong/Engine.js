import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { ThreeJSUtils } from "../../scripts/game-utils/ThreeJSUtils.js";
import { KeyHandler } from "../../scripts/game-utils/KeyHandler.js";
import { Player } from "./Scene/player/Player.js";
import { Scene } from "./Scene/Scene.js";
import { showError } from "../error/ErrorPage.js";

export class Engine {
	threeJS;
	keyHandler;
	scene;
	component;
	isAIGame;
	gameStarted = false;

	constructor(
		component,
		isAIGame = false,
		players,
		playerSide = "NA",
		gameSession = -1,
		sameSystem = "NA"
	) {
		this.component = component;
		this.isAIGame = isAIGame;
		this.players = players;
		this.threeJS = new ThreeJSUtils(this);
		this.playerSide = playerSide;
		this.gameSession = gameSession;
		this.sameSystem = sameSystem;
		this.keyHandler = new KeyHandler(this, this.isAIGame);
		this.scene = new Scene();
	}

	async createScene() {
		if (!this.component.container) {
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

		const player2 = new Player(this.isAIGame);
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
		this.threeJS.stopAnimationLoop();
		this.threeJS.disposeResources();
	}

	renderFrame() {
		this.threeJS.renderScene(this.scene.threeJSScene);
	}

	get isAIGame() {
		return this.isAIGame;
	}

	get scene() {
		return this.scene;
	}

	set scene(newScene) {
		this.clearScene(this.scene.threeJSScene);
		this.scene = newScene;
	}

	clearScene(scene) {
		for (let i = scene.children.length - 1; i >= 0; i--) {
			this.clearScene(scene.children[i]);
			scene.remove(scene.children[i]);
		}
		scene.geometry?.dispose();
		scene.material?.dispose();
	}


	displayGameScene() {
		const clock = new THREE.Clock();

		this.threeJS.beginAnimationLoop(() => {
			const currentTime = Date.now();
			const delta = clock.getDelta();
			this.scene.updateFrame(currentTime, delta);

			this.renderFrame();
			this.threeJS.controls.update();
		});
	}

	get component() {
		return this.component;
	}

	get threeJS() {
		return this.threeJS;
	}

	updateCamera(position, view) {
		this.threeJS.controls.target.set(
			view.x,
			view.y,
			view.z
		);
		this.threeJS.updateCameraPosition(position);
		this.threeJS.updateCameraView(view);
	}

	resizeHandler() {
		if (this.scene instanceof Scene) {
			this.scene.updateCamera();
		}
	}

	startListeningForKeyHooks() {
		if (this.gameSession != -1)
			this.keyHandler.listenForKeys(
				"remote",
				this.playerSide,
				this.players,
				this.gameSession,
				this.sameSystem
			);
		else this.keyHandler.listenForKeys();
	}
}
