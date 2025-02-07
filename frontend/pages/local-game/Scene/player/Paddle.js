import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { HandlePaddleEdge } from "../HandlePaddleEdge.js";


export class Paddle {
    #threeJSGroup = new THREE.Group();
    #moveSpeed = 15;
    #movement = new THREE.Vector3(0, 0, 0);
    #boardEdgeLimit = 10;
    #lastReactionTime = 0;
    #isAIControlled = false;
    #isResetting = false;

    #paddleObject;
    #light;

    #topCollisionSegment;
    #frontCollisionSegment;
    #bottomCollisionSegment;

    #playerPosition;
    #paddleSize = new THREE.Vector3(1, 5, 1); // Adjusted paddle size with depth.
    #originalSize = this.#paddleSize.clone();
    #paddleIsOnTheRight;

    constructor(paddleIsOnTheRight, playerPosition, isAIControlled = false) {
        this.#paddleIsOnTheRight = paddleIsOnTheRight;
        this.#isAIControlled = isAIControlled;
        this.#threeJSGroup.position.set(paddleIsOnTheRight ? 8 : -8, 0, 1); // Lift paddle above the board.

        const color = this.#getColor();
        this.#addPaddleToGroup(color);
        this.#addLightToGroup(color);

        this.#playerPosition = playerPosition;

        this.#setCollisionSegments();
    }

    updateFrame(timeDelta, pongGameBox, ballPosition = null, gameStarted = false) {
        if (!gameStarted) return; // Skip movement if the game is not active

        if (this.#isAIControlled && ballPosition) {
            this.#moveAIPaddle(ballPosition);
        }

        if (!this.#isAIControlled) {
            const movement = new THREE.Vector3()
                .copy(this.#movement)
                .multiplyScalar(timeDelta);
            this.#threeJSGroup.position.add(movement);
        }

        this.#constrainPaddle(pongGameBox);
        this.#setCollisionSegments();
    }

    resetSize() {
        this.#paddleSize.copy(this.#originalSize);
        this.#updatePaddleGeometry();
        // console.log("Paddle size reset to:", this.#paddleSize.toArray());
    }

    #updatePaddleGeometry() {
        this.#paddleObject.geometry = new THREE.BoxGeometry(
            this.#paddleSize.x,
            this.#paddleSize.y,
            this.#paddleSize.z
        );
    }

    disableAIMovementTemporarily() {
        this.#isResetting = true;

        setTimeout(() => {
            this.#isResetting = false; // Re-enable AI movement after reset
        }, 1000); // Allow delay for reset to take effect
    }

    #moveAIPaddle(ballPosition, ballVelocity) {
        if (this.#isResetting) {
            // console.log("Skipping AI movement during reset");
            return;
        }

        const reactionDelay = 50;
        const currentTime = Date.now();

        if (currentTime - this.#lastReactionTime < reactionDelay) return;

        this.#lastReactionTime = currentTime;

        const anticipationFactor = 0.3;
        const anticipatedPositionY =
            ballPosition.y + (ballVelocity?.y || 0) * anticipationFactor;
        const distanceToBall =
            anticipatedPositionY - this.#threeJSGroup.position.y;

        const maxAISpeed = 3.5;
        let aiSpeed = Math.min(maxAISpeed, Math.abs(distanceToBall) * 0.15);

        if (Math.abs(anticipatedPositionY) > this.#boardEdgeLimit)
        {
            aiSpeed *= 0.8;
        }

        const missChance = 0.05;
        if (Math.random() < missChance) {
            return;
        }

        const movementThreshold = 0.1;
        if (Math.abs(distanceToBall) > movementThreshold) {
            const newYPosition =
                this.#threeJSGroup.position.y +
                (distanceToBall > 0 ? aiSpeed : -aiSpeed);

            this.#threeJSGroup.position.setY(newYPosition);
        }
    }

    #constrainPaddle(pongGameBox) {
        if (this.#threeJSGroup.position.y < pongGameBox.y_min) {
            this.#threeJSGroup.position.y = pongGameBox.y_min;
        } else if (this.#threeJSGroup.position.y > pongGameBox.y_max) {
            this.#threeJSGroup.position.y = pongGameBox.y_max;
        }
    }

    setDirection(direction) {

        this.#movement.y =
            direction === "up"
                ? this.#moveSpeed
                : direction === "down"
                ? -this.#moveSpeed
                : 0;

    }

    setPosition(positionJson) {

       this.#threeJSGroup.position.set(
            positionJson["x"],
            positionJson["y"],
            positionJson["z"]
        );
        this.#setCollisionSegments();
    }

    getPosition() {
        return this.#threeJSGroup.position;
    }

    get threeJSGroup() {
        return this.#threeJSGroup;
    }

    #getColor() {
        return new THREE.Color(this.#paddleIsOnTheRight ? 0xff1111 : 0x0000ff);
    }

    #addPaddleToGroup(color) {
        this.#paddleObject = new THREE.Mesh(
            new THREE.BoxGeometry(
                this.#paddleSize.x,
                this.#paddleSize.y,
                this.#paddleSize.z
            ),
            new THREE.MeshStandardMaterial({ color: color })
        );
        this.#paddleObject.position.set(0, 0, 1); // Set z position to lift paddle above board.
        this.#threeJSGroup.add(this.#paddleObject);
    }

    #addLightToGroup(color) {
        this.#light = new THREE.PointLight(color, 30, 15); // Increased intensity for better visibility.
        this.#light.position.z += this.#paddleSize.z * 2;
        this.#threeJSGroup.add(this.#light);
    }

    #setCollisionSegments() {
        const xLeft =
            this.#playerPosition.x +
            this.#threeJSGroup.position.x -
            this.#paddleSize.x * 0.5;
        const xRight =
            this.#playerPosition.x +
            this.#threeJSGroup.position.x +
            this.#paddleSize.x * 0.5;

        const yTop =
            this.#playerPosition.y +
            this.#threeJSGroup.position.y +
            this.#paddleSize.y * 0.5;
        const yBottom =
            this.#playerPosition.y +
            this.#threeJSGroup.position.y -
            this.#paddleSize.y * 0.5;

        const topLeft = new THREE.Vector2(xLeft, yTop);
        const topRight = new THREE.Vector2(xRight, yTop);
        const bottomRight = new THREE.Vector2(xRight, yBottom);
        const bottomLeft = new THREE.Vector2(xLeft, yBottom);

        this.#topCollisionSegment = new HandlePaddleEdge(topLeft, topRight);
        this.#bottomCollisionSegment = new HandlePaddleEdge(bottomLeft, bottomRight);
        this.#frontCollisionSegment = this.#paddleIsOnTheRight
            ? new HandlePaddleEdge(bottomLeft, topLeft)
            : new HandlePaddleEdge(bottomRight, topRight);
    }

    get topCollisionSegment() {
        return this.#topCollisionSegment;
    }

    get frontCollisionSegment() {
        return this.#frontCollisionSegment;
    }

    get bottomCollisionSegment() {
        return this.#bottomCollisionSegment;
    }

    get paddleIsOnTheRight() {
        return this.#paddleIsOnTheRight;
    }

    get size() {
        return this.#paddleSize;
    }
}
