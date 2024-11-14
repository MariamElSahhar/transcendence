import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import * as TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";
import { SceneSky } from "./SceneSky.js";
import { PaddleBoundingBox } from './PaddleBoundingBox.js';
import { Match } from "./Match.js";

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
            await this.#match.init(engine); // Ensure Match is fully initialized
            this.#threeJSScene.add(this.#match.threeJSGroup);

            // Initialize the sky with SceneSky and set to bright day mode
            this.#sky = new SceneSky();
            this.#threeJSScene.add(this.#sky.sky); // Add the sky to the scene background
            this.setLightTheme(); // Set daylight theme directly for SceneSky

            // Adjust ambient and directional lights for stronger daylight
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Full intensity
            this.#threeJSScene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
            directionalLight.position.set(50, 100, 50); // Position high to simulate sunlight
            directionalLight.castShadow = true;
            this.#threeJSScene.add(directionalLight);

            const player = this.#match.players[0]; // Access player only after init
            this.#boardSize = player.board.size;

            if (typeof PaddleBoundingBox === 'function') {
                this.#paddleBoundingBox = new PaddleBoundingBox(
                    this.#boardSize.y, player.paddle.size.y
                );
            } else {
                console.error("PaddleBoundingBox is not defined.");
            }

            if (this.#engine.threeJS.controls) {
                this.#engine.threeJS.controls.target.set(30, 25, 0);
            } else {
                console.error("threeJS controls are not defined on engine.");
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



 //import * as TWEEN from "../../../../node_modules/@tweenjs/tween.js/dist/tween.umd.js";
// //import * as THREE from "../../../../node_modules/three/build/three.module.js";
// import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
// import * as TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";

// import { SceneSky } from "./SceneSky.js";
// import {PaddleBoundingBox} from './PaddleBoundingBox.js';
// import { Match } from "./Match.js";
// export class Scene {
//   #engine;
//   #threeJSScene = new THREE.Scene();
//   #match = new Match();
//   #paddleBoundingBox;
//   #matchHalfWidth = 20.;
//   #matchHalfHeight = 13.75;
//   #cameraPadding = 10.;
//   #sky;
//   #boardSize;
//   #animationHeight = 20;

//   constructor() {}

//   async init(engine) {
//     this.#engine = engine;
  
//     try {
//       await this.#match.init(engine); // Ensure Match is fully initialized
//       this.#threeJSScene.add(this.#match.threeJSGroup);
  
//       this.#sky = new SceneSky(); // Ensure SceneSky is initialized correctly
//       this.#threeJSScene.add(this.#sky.sky);
  
//       const light = new THREE.AmbientLight(0xffffff, 0.2);
//       this.#threeJSScene.add(light);
  
//       const player = this.#match.players[0]; // Access player only after init
//       this.#boardSize = player.board.size;
  
//       if (typeof PaddleBoundingBox === 'function') {
//         this.#paddleBoundingBox = new PaddleBoundingBox(
//           this.#boardSize.y, player.paddle.size.y
//         );
//       } else {
//         console.error("PaddleBoundingBox is not defined.");
//       }
  
//       if (this.#engine.threeJS.controls) {
//         this.#engine.threeJS.controls.target.set(30, 25, 0);
//       } else {
//         console.error("threeJS controls are not defined on engine.");
//       }
//     } catch (error) {
//       console.error("Error during Scene initialization:", error);
//       throw error;
//     }
//   }
  

//   setLightTheme() {
//     this.#sky.setLightTheme();
//   }

//   setDarkTheme() {
//     this.#sky.setDarkTheme();
//   }

//   updateFrame(currentTime, timeDelta) {
//     this.#match.updateFrame(
//         timeDelta,
//         currentTime,
//         this.#paddleBoundingBox,
//         this.#boardSize,
//     );
//   }

//   setPlayerPaddleDirection(direction, index) {
//     this.#match.players[index].paddle.setDirection(direction);
//   }

//   updateCamera(animation = false) {
//     const matchPosition = this.#match.threeJSGroup.position;
//     const xHeight = (this.#matchHalfWidth + this.#cameraPadding * .5) /
//       Math.tan(this.#engine.threeJS.getCameraHorizontalFOVRadian() * .5);
//     const yHeight = (this.#matchHalfHeight + this.#cameraPadding * .5) /
//       Math.tan(this.#engine.threeJS.getCameraVerticalFOVRadian() * .5);
//     const cameraHeight = Math.max(xHeight, yHeight) -
//         animation * this.#animationHeight;

//     const cameraPosition = new THREE.Vector3(
//         matchPosition.x,
//         matchPosition.y,
//         cameraHeight,
//     );
//     const cameraLookAt = matchPosition.clone();
//     this.#engine.updateCamera(cameraPosition, cameraLookAt);

//     if (animation) {
//       const newCameraPosition = new THREE.Vector3(
//           matchPosition.x,
//           matchPosition.y,
//           cameraHeight + this.#animationHeight,
//       );

//       new TWEEN.Tween(cameraPosition)
//           .to(newCameraPosition, 3000)
//           .easing(TWEEN.Easing.Quadratic.InOut)
//           .onUpdate(() => {
//             this.#engine.updateCamera(cameraPosition, cameraLookAt);
//           })
//           .start();
//     }
//   }

//   get match() {
//     return this.#match;
//   }

//   get threeJSScene() {
//     return this.#threeJSScene;
//   }

//   get boardSize() {
//     return this.#boardSize;
//   }
// }
