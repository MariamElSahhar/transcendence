import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { HandlePaddleEdge } from "../HandlePaddleEdge.js";

const LEFT_PADDLE_COLOR = 0xe52521;
const RIGHT_PADDLE_COLOR = 0x43b047;

export class Paddle {
	#threeJSGroup = new THREE.Group();
	#moveSpeed = 15;
	#movement = new THREE.Vector3(0, 0, 0);
	#boardEdgeLimit = 10;
	lastReactionTime = Date.now();
	#isAIControlled = false;
	ballPrevPosX;
	ballPrevPredY;
	ballPrevPredX;
	ballPrevPosY;
	ballVelocityX;
	ballVelocityY;
	startTime;
	#isResetting = false;
	aiSpeed;
	anticipatedPositionY;
	distanceToBall;
	lastBallMovement;

	#paddleObject;
	#light;
	flag = 0;
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

		const color = this.#paddleIsOnTheRight
			? RIGHT_PADDLE_COLOR
			: LEFT_PADDLE_COLOR;
		this.#addPaddleToGroup(color);
		this.#addLightToGroup();

		this.#playerPosition = playerPosition;

		this.#setCollisionSegments();
	}

	updateFrame(
		timeDelta,
		pongGameBox,
		ballPosition = null,
		gameStarted = false,
		velocity
	) {
		if (!gameStarted) return; // Skip movement if the game is not active

		if (this.#isAIControlled && ballPosition) {
			this.#moveAIPaddle(ballPosition, velocity);
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

	#moveAIPaddle(ballPosition, velocity) {
		const reactionDelay = 1000;
		const movementDelay = 50;
		const currentTime = Date.now();
		const movementThreshold = 0.1;
		const maxSpeed = 3.5;
		const smoothMove = 0.1;

		if (this.#isResetting) {
			return;
		}

		if (this.startTime == 0) {
			this.flag = 0;
            this.startTime =currentTime;
		}
		if (this.flag == 1 && currentTime - this.lastBallMovement > movementDelay) {
			this.ballPrevPredX = this.ballPrevPredX + this.ballVelocityX * ((movementDelay+50)/1000);
			this.ballPrevPredY = this.ballPrevPredY + this.ballVelocityY * ((movementDelay+50)/1000);
			this.distanceToBall = this.ballPrevPredY - this.#threeJSGroup.position.y;
			if (Math.abs(this.ballPrevPredY) > this.#boardEdgeLimit) {
				this.ballVelocityY = - this.ballVelocityY;
				console.log("here");
				// this.ballPrevPredY = this.ballPrevPredY + this.ballVelocityY * ((movementDelay+100)/1000);
			}
			// this.aiSpeed = 15;
			// console.log(this.aiSpeed)
			// if (Math.abs(this.ballPrevPredY) > this.#boardEdgeLimit) {
			// 	AISpeed *= 0.9;
			// }
			if (Math.abs(this.distanceToBall) > movementThreshold) {
				let moveAmount = this.distanceToBall * smoothMove;
				moveAmount = Math.sign(moveAmount) * Math.min(Math.abs(moveAmount), minSpeed, maxSpeed);
				console.log(moveAmount)
				const newYPosition = this.#threeJSGroup.position.y + moveAmount;
				this.#threeJSGroup.position.setY(newYPosition);
			}
			this.lastBallMovement = currentTime;
		}
		if ((this.flag == 0 && currentTime - this.startTime > 500) || (this.flag == 1 && currentTime - this.lastReactionTime > reactionDelay)) {
			this.flag = 1;
			this.ballVelocityX = velocity.x;
			this.ballVelocityY = velocity.y;
			this.ballPrevPredX = this.ballPrevPosX = ballPosition.x;
            this.ballPrevPredY = this.ballPrevPosY = ballPosition.y;
			this.lastBallMovement = currentTime;
			this.lastReactionTime = Date.now();
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

	#addLightToGroup() {
		this.#light = this.paddleIsOnTheRight
			? new THREE.PointLight(0x00ffff, 4, 50)
			: new THREE.PointLight(0xff30ff, 10, 50);
		this.#light.position.z += this.#paddleSize.z * 1.5;
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
		this.#bottomCollisionSegment = new HandlePaddleEdge(
			bottomLeft,
			bottomRight
		);
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
