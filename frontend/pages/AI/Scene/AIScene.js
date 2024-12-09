import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import * as TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";
import { SceneSky } from "./SceneSky.js";
import { PaddleBoundingBox } from '../../local/Scene/PaddleBoundingBox.js'
import { Match } from "./AIMatch.js";

export class Scene {
    #engine;
    #threeJSScene = new THREE.Scene();
    #match = new Match();
    #paddleBoundingBox;
    #matchHalfWidth = 20.;
    #matchHalfHeight = 13.75;
    #cameraPadding = 10.;
    #sky;
    #boardSize;
    #animationHeight = 20;

    constructor() {}

    async init(engine) {
      this.#engine = engine;
  
      try {
          console.log("Initializing match...");
          await this.#match.init(engine, true); // Pass true to enable AI for the second player
          this.#threeJSScene.add(this.#match.threeJSGroup);
          console.log("Match initialized and added to scene.");
  
          console.log("Initializing SceneSky...");
          this.#sky = new SceneSky();
          this.#threeJSScene.add(this.#sky.sky); // Add the sky to the scene background
          this.setLightTheme();
          console.log("SceneSky initialized and light theme set.");
  
          console.log("Setting up lights...");
          const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
          this.#threeJSScene.add(ambientLight);
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
          directionalLight.position.set(50, 100, 50);
          directionalLight.castShadow = true;
          this.#threeJSScene.add(directionalLight);
  
          const player = this.#match.players[0];
          if (!player) throw new Error("Player not initialized in match.");
          this.#boardSize = player.board.size;
          console.log("Player and board size initialized.");
  
          if (typeof PaddleBoundingBox === 'function') {
              this.#paddleBoundingBox = new PaddleBoundingBox(
                  this.#boardSize.y, player.paddle.size.y
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

    updateFrame(currentTime, timeDelta) {
        this.#match.updateFrame(
            timeDelta,
            currentTime,
            this.#paddleBoundingBox,
            this.#boardSize,
        );
    }

    setPlayerPaddleDirection(direction, index) {
        this.#match.players[index].paddle.setDirection(direction);
    }

    updateCamera(animation = false) {
        const matchPosition = this.#match.threeJSGroup.position;
        const xHeight = (this.#matchHalfWidth + this.#cameraPadding * .5) /
            Math.tan(this.#engine.threeJS.getCameraHorizontalFOVRadian() * .5);
        const yHeight = (this.#matchHalfHeight + this.#cameraPadding * .5) /
            Math.tan(this.#engine.threeJS.getCameraVerticalFOVRadian() * .5);
        const cameraHeight = Math.max(xHeight, yHeight) -
            animation * this.#animationHeight;

        const cameraPosition = new THREE.Vector3(
            matchPosition.x,
            matchPosition.y,
            cameraHeight,
        );
        const cameraLookAt = matchPosition.clone();
        this.#engine.updateCamera(cameraPosition, cameraLookAt);

        if (animation) {
            const newCameraPosition = new THREE.Vector3(
                matchPosition.x,
                matchPosition.y,
                cameraHeight + this.#animationHeight,
            );

            new TWEEN.Tween(cameraPosition)
                .to(newCameraPosition, 3000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    this.#engine.updateCamera(cameraPosition, cameraLookAt);
                })
                .start();
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
