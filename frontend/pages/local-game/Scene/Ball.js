import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { CollisionHandler } from "./CollisionHandler.js";
import {sendWebSocketMessage} from "../../../scripts/utils/websocket-manager.js"

export class Ball {
  #threeJSGroup = new THREE.Group();
  movement = new THREE.Vector3(0., 0., 0.);
  #acceleration = 1.1;
  #radius = 1.;
  #mesh;
  #light;
  movementSet=false;

  constructor() {
    this.#initializeBall();
    this.#initializeLight();
    this.#threeJSGroup.position.set(0., 0., 1.);
  }

  #initializeBall() {
    this.#mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(this.#radius, 16, 8),
      new THREE.MeshPhysicalMaterial({
        roughness: 0.5,
        metalness: 1,
        color: 0xffffff,
      })
    );
    this.#mesh.position.set(0., 0., 0.);
    this.#mesh.castShadow = false;
    this.#mesh.receiveShadow = false;
    this.#threeJSGroup.add(this.#mesh);
  }

  #initializeLight() {
    this.#light = new THREE.PointLight(0xffffff, 10.0, 10.);
    this.#light.position.set(0., 0., 0.);
    this.#light.castShadow = true;
    this.#threeJSGroup.add(this.#light);
  }

  async prepareForMatch(gameType, isHost=null, gameID) {
    // console.log("CENTERE")
    this.#threeJSGroup.position.set(0., 0., this.#threeJSGroup.position.z);
    await this.randomizeMovement(gameType,isHost,gameID);
  }

  removeBall() {
    this.#threeJSGroup.remove(this.#mesh);
    this.#threeJSGroup.remove(this.#light);
  }

  updateFrame(timeDelta, boardSize, match) {
    if (this.movement.x === 0. || timeDelta === 0.) {
      return;
    }

    this.#handleCollision(timeDelta, boardSize, match);
  }

  #handleCollision(timeDelta, boardSize, match) {
    const collisionHandler = this.movement.x < 0
      ? new CollisionHandler(match.players[0].paddle, boardSize)
      : new CollisionHandler(match.players[1].paddle, boardSize);
    collisionHandler.updateBallPositionAndMovement(timeDelta, match);
  }

  randomizeMovement(gameType, isHost, gameID) {
    // console.log(gameType, isHost, gameID);

    return new Promise((resolve) => {
        if (gameType === "remote") {
          // console.log("here")
            if (isHost) {
                // console.log("how?>>>>>>>>");
                let ballmovement = new THREE.Vector3(0., 0., 0.);
                ballmovement.x = Math.random() < 0.5 ? -1 : 1;
                ballmovement.y = Math.random() < 0.5 ? -0.5 : 0.5;
                ballmovement.normalize().multiplyScalar(15);
                sendWebSocketMessage({ type: "ballPosition", position: ballmovement, gameSession: gameID });
            //     // this.movementSet = true;
            }

            // // Check every 100ms if movement is set, then resolve
            const checkInterval = setInterval(() => {
                if (this.movementSet) {
                  let index = isHost?0 : 1
				          sendWebSocketMessage({ action: "ready" , gameSession:gameID, playerSide:index});

                    clearInterval(checkInterval);
                    console.log("Movement set, resolving...");
                    // this.movementSet=false;
                    resolve("Success");
                }
            }, 100);
        } else {
            this.movement.x = Math.random() < 0.5 ? -1 : 1;
            this.movement.y = Math.random() < 0.5 ? -0.5 : 0.5;
            this.movement.normalize().multiplyScalar(15);
            resolve("Success"); // Resolve immediately for non-remote mode
        }
    });
}

  setMovement(movementJson) {
	// console.log("pls be here")
    this.movement.set(movementJson.x, movementJson.y, movementJson.z);
    this.movementSet=true;
  }

  setMovementX(x) {
    this.movement.x = x;
  }

  setMovementY(y) {
    this.movement.y = y;
  }

  set movement(movement) {
    this.movement.set(movement.x, movement.y, 0);
  }

  get movement() {
    return this.movement;
  }

  get threeJSGroup() {
    return this.#threeJSGroup;
  }

  get acceleration() {
    return this.#acceleration;
  }

  getPosition() {
    return this.#threeJSGroup.position;
  }

  setPosition(positionJson) {
    this.#threeJSGroup.position.set(positionJson.x, positionJson.y, positionJson.z);
  }

  get radius() {
    return this.#radius;
  }
}
