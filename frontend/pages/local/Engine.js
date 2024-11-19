
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import * as TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.umd.js";


import { _ThreeJS } from "./_ThreeJS.js";
import { _KeyHookHandler } from "./_KeyHookHandler.js";
import { Scene } from "./Scene/Scene.js";

export class Engine {
  #threeJS;
  #keyHookHandler;
  #scene;
  #component;

  constructor(component) {
    this.#component = component;
    this.#threeJS = new _ThreeJS(this);
    this.#keyHookHandler = new _KeyHookHandler(this);
    this.#scene = new Scene();
  }

  async startGame() {
    if (!this.#component.container) {
      console.error("Container not found in component; delaying initialization.");
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
        cameraLookAt.z,
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
// import * as THREE from "../../../node_modules/three/build/three.module.js";
// import * as TWEEN from "../../../node_modules/@tweenjs/tween.js/dist/tween.umd.js";

// import { _ThreeJS } from "./_ThreeJS.js";
// import { _KeyHookHandler } from "./_KeyHookHandler.js";
// import { Scene } from "./Scene/Scene.js";

// export class Engine {
//   #threeJS;
//   #keyHookHandler;
//   #scene;
//   #component;

//   constructor(component) {
//     this.#component = component;
//   }

//   async init() {
//     await this.initializeDependencies();
//   }

//   async initializeDependencies() {
//     try {
//       // Check if component and container exist and are valid
//       if (!this.#component || !(this.#component.container instanceof Element)) {
//         throw new Error("Component or container is not defined or not an Element");
//       }

//       // Initialize dependencies
//       this.#threeJS = new _ThreeJS(this);
//       console.log("_ThreeJS initialized:", this.#threeJS);
//       this.#keyHookHandler = new _KeyHookHandler(this);
//       console.log("_KeyHookHandler initialized:", this.#keyHookHandler);
//       this.#scene = new Scene();
//       console.log("Scene initialized:", this.#scene);

//     } catch (error) {
//       console.error("Failed to initialize Engine dependencies:", error);
//     }
//   }

//   async startGame() {
//     // Ensure that `this.#scene` is initialized before starting the game
//     if (!this.#scene) {
//       console.error("Scene is not initialized. Call init() before starting the game.");
//       return;
//     }

//     await this.#scene.init(this);
//     if (!this.#scene.threeJSScene) {
//       console.error("threeJSScene was not initialized.");
//       return;
//     }
//     this.#scene.updateCamera();
//     this.startListeningForKeyHooks();
//     this.displayGameScene();
//     this.#component.startCountdown(this.#scene.match.ballStartTime / 1000);
//   }

//   cleanUp() {
//     if (this.#scene && this.#scene.threeJSScene) {
//       this.clearScene(this.#scene.threeJSScene);
//     } else {
//       console.warn("No threeJSScene to clear in cleanUp.");
//     }
//     this.#threeJS.clearRenderer();
//   }

//   renderFrame() {
//     this.#threeJS.renderFrame(this.#scene.threeJSScene);
//   }

//   get scene() {
//     return this.#scene;
//   }

//   set scene(newScene) {
//     this.clearScene(this.#scene.threeJSScene);
//     this.#scene = newScene;
//   }

//   clearScene(scene) {
//     while (scene.children.length > 0) {
//       this.clearScene(scene.children[0]);
//       scene.remove(scene.children[0]);
//     }
//     if (scene.geometry) scene.geometry.dispose();
//     if (scene.material) scene.material.dispose();
//   }

//   setAnimationLoop(loopFunction) {
//     this.#threeJS.setAnimationLoop(loopFunction);
//   }

//   stopAnimationLoop() {
//     this.#threeJS.stopAnimationLoop();
//   }

//   displayGameScene() {
//     const clock = new THREE.Clock();

//     this.setAnimationLoop(() => {
//       const currentTime = Number(Date.now());
//       const delta = clock.getDelta();
//       this.#scene.updateFrame(currentTime, delta);

//       TWEEN.update();
//       this.#threeJS.updateControls();
//       this.renderFrame();
//     });
//   }

//   updateCamera(cameraPosition, cameraLookAt) {
//     this.#threeJS.controls.target.set(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);
//     this.#threeJS.setCameraPosition(cameraPosition);
//     this.#threeJS.setCameraLookAt(cameraLookAt);
//   }

//   resizeHandler() {
//     if (this.#scene instanceof Scene) {
//       this.#scene.updateCamera();
//     }
//   }

//   startListeningForKeyHooks() {
//     this.#keyHookHandler.startListeningForKeyHooks();
//   }
// }


// export class Engine {
//   #threeJS;
//   #keyHookHandler;
//   #scene;
//   #component;

//   constructor(component) {
//     this.#component = component;
//     this.initializeDependencies();
//   }

//   // async initializeDependencies() {
//   //   try {
//   //     // Initialize dependencies with shared imports
//   //     this.#threeJS = new _ThreeJS(this);
//   //     console.log("_ThreeJS initialized:", this.#threeJS);
//   //     this.#keyHookHandler = new _KeyHookHandler(this);
//   //     console.log("_KeyHookHandler initialized:", this.#keyHookHandler);
//   //     this.#scene = new Scene();
//   //     console.log("Scene initialized:", this.#scene);

//   //   } catch (error) {
//   //     console.error("Failed to initialize Engine dependencies:", error);
//   //   }
//   // }
//     async initializeDependencies() {
//       try {
//           // Check if component and container exist and are valid
//           if (!this.#component || !(this.#component.container instanceof Element)) {
//               throw new Error("Component or container is not defined or not an Element");
//           }

//           // Initialize dependencies
//           this.#threeJS = new _ThreeJS(this);
//           console.log("_ThreeJS initialized:", this.#threeJS);
//           this.#keyHookHandler = new _KeyHookHandler(this);
//           console.log("_KeyHookHandler initialized:", this.#keyHookHandler);
//           this.#scene = new Scene();
//           console.log("Scene initialized:", this.#scene);

//       } catch (error) {
//           console.error("Failed to initialize Engine dependencies:", error);
//       }
//   }

//   async startGame() {
//     await this.#scene.init(this);
//     if (!this.#scene.threeJSScene) {
//         console.error("threeJSScene was not initialized.");
//         return;
//     }
//     this.#scene.updateCamera();
//     this.startListeningForKeyHooks();
//     this.displayGameScene();
//     this.#component.startCountdown(this.#scene.match.ballStartTime / 1000);
//   }


//   // async startGame() {
//   //   await this.#scene.init(this);
//   //   this.#scene.updateCamera();
//   //   this.startListeningForKeyHooks();
//   //   this.displayGameScene();
//   //   this.#component.startCountdown(this.#scene.match.ballStartTime / 1000);
//   // }

//   // cleanUp() {
//   //   this.clearScene(this.#scene.threeJSScene);
//   //   this.#threeJS.clearRenderer();
//   // }
//   cleanUp() {
//     if (this.#scene && this.#scene.threeJSScene) {
//         this.clearScene(this.#scene.threeJSScene);
//     } else {
//         console.warn("No threeJSScene to clear in cleanUp.");
//     }
//     this.#threeJS.clearRenderer();
// }


//   renderFrame() {
//     this.#threeJS.renderFrame(this.#scene.threeJSScene);
//   }

//   get scene() {
//     return this.#scene;
//   }

//   set scene(newScene) {
//     this.clearScene(this.#scene.threeJSScene);
//     this.#scene = newScene;
//   }

//   clearScene(scene) {
//     while (scene.children.length > 0) {
//       this.clearScene(scene.children[0]);
//       scene.remove(scene.children[0]);
//     }
//     if (scene.geometry) scene.geometry.dispose();
//     if (scene.material) scene.material.dispose();
//   }

//   setAnimationLoop(loopFunction) {
//     this.#threeJS.setAnimationLoop(loopFunction);
//   }

//   stopAnimationLoop() {
//     this.#threeJS.stopAnimationLoop();
//   }

//   displayGameScene() {
//     const clock = new THREE.Clock();

//     this.setAnimationLoop(() => {
//       const currentTime = Number(Date.now());
//       const delta = clock.getDelta();
//       this.#scene.updateFrame(currentTime, delta);

//       TWEEN.update();
//       this.#threeJS.updateControls();
//       this.renderFrame();
//     });
//   }

//   get component() {
//     return this.#component;
//   }

//   get threeJS() {
//     return this.#threeJS;
//   }

//   updateCamera(cameraPosition, cameraLookAt) {
//     this.#threeJS.controls.target.set(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);
//     this.#threeJS.setCameraPosition(cameraPosition);
//     this.#threeJS.setCameraLookAt(cameraLookAt);
//   }

//   resizeHandler() {
//     if (this.#scene instanceof Scene) {
//       this.#scene.updateCamera();
//     }
//   }

//   startListeningForKeyHooks() {
//     this.#keyHookHandler.startListeningForKeyHooks();
//   }
// }


