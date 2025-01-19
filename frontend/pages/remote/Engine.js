import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { ThreeJSUtils } from "../game-utils/ThreeJSUtils.js";
import { KeyHandler  } from "../game-utils/KeyHandler.js";
import { getUserSessionData } from "../../scripts/utils/session-manager.js";
import { Player } from "../local-game/Scene/player/Player.js";
import { Scene } from "../local-game/Scene/Scene.js";

export class Engine {
  #threeJS;
  #keyHookHandler;
  #scene;
  #component;
  #isAIGame;

  constructor(component, isAIGame = false, players) {
    this.#component = component;
    this.#isAIGame = isAIGame;
    this.players = players;
    this.#threeJS = new ThreeJSUtils(this);
    this.#keyHookHandler = new KeyHandler (this, this.#isAIGame);
    this.#scene = new Scene();
  }

  async startGame() {
    if (!this.#component.container) {
      console.error("Container not found in component; delaying initialization.");
      return;
    }

    console.log("Players in Engine:", this.players);
    if (!this.players || this.players.length < 2) {
      console.error("Players are not correctly initialized:", this.players);
      return;
    }

    const player1 = new Player(false);
    await player1.init(0, 3, this.players[0]);

    const player2 = new Player(this.#isAIGame);
    await player2.init(1, 3, this.players[1]);

    await this.#scene.init(this, [player1, player2]);

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
      this.#scene.updateFrame(currentTime, delta);

      this.#threeJS.updateControls();
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
	if(this.players[0] == getUserSessionData().username)
		this.playerSide = "left"
	else
		this.playerSide="right"

	console.log("LOOK AT THIS", getUserSessionData().username == this.players[0],getUserSessionData().username,this.players[0], this.playerSide)
    this.#keyHookHandler.startListeningForKeys("remote",this.playerSide);
  }
}
