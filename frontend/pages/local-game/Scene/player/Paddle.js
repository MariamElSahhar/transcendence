import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { HandlePaddleEdge } from "../HandlePaddleEdge.js";

const LEFT_PADDLE_COLOR = 0xe52521;
const RIGHT_PADDLE_COLOR = 0x43b047;

export class Paddle {
	#threeJSGroup = new THREE.Group();
	#moveSpeed = 15;
	#movement = new THREE.Vector3(0, 0, 0);
	#boardEdgeLimitY = 13.75;
	#boardEdgeLimitX = 18;
	lastReactionTime = Date.now();
	#isAIControlled = false;
	ballPredY;
	ballPredX;
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
		const smoothMove = 0.2;

		if (this.#isResetting) {
			return;
		}

		if (this.startTime == 0) {
			this.flag = 0;
            this.startTime =currentTime;
		}
		if (this.flag == 1 && currentTime - this.lastBallMovement > movementDelay) {
			// console.log(Math.abs(this.ballPredY + this.ballVelocityY * ((movementDelay+50)/1000)));
			// if (Math.abs(this.ballPredY + this.ballVelocityY * ((movementDelay+50)/1000)) > this.#boardEdgeLimit)
			// {
			// 	this.ballVelocityY = -this.ballVelocityY;
			// 	console.log("changing!!!",this.ballVelocityY, velocity.y, this.ballVelocityX,  velocity.x);
			// }
			// console.log(this.ballVelocityY, velocity.y, this.ballVelocityX,  velocity.x);

			// 	// this.ballPredY = this.ballPredY + this.ballVelocityY * ((movementDelay+100)/1000);
			// }
			this.ballPredX = this.ballPredX + this.ballVelocityX * ((movementDelay)/1000);
			this.ballPredY = this.ballPredY + this.ballVelocityY * ((movementDelay)/1000);
			// console.log(this.#boardEdgeLimit)


			let futurePredY = this.ballPredY + this.ballVelocityY * ((movementDelay + 100)/1000);
			if (futurePredY > this.#boardEdgeLimitY || futurePredY < -this.#boardEdgeLimitY)
			{
				// this.ballVelocityY = -this.ballVelocityY;
				futurePredY = futurePredY > 0 ? this.#boardEdgeLimitY - (futurePredY  - this.#boardEdgeLimitY) : -this.#boardEdgeLimitY - (futurePredY + this.#boardEdgeLimitY);
				console.log("WE'RE IN------------------------------------------------------------------------------------", futurePredY);
				// this.ballVelocityY = -this.ballVelocityY;
			}
			let futurePredX = this.ballPredX + this.ballVelocityX * ((movementDelay + 100)/1000);
			if (futurePredX > this.#boardEdgeLimitX || futurePredX < -this.#boardEdgeLimitX)
			{
				// this.ballVelocityY = -this.ballVelocityY;
				console.log(futurePredX > 0, "if this is yes on top we actuaklly need to add");
				futurePredX = futurePredX > 0 ? this.#boardEdgeLimitX - (futurePredX  - this.#boardEdgeLimitX) : -this.#boardEdgeLimitX - (futurePredX + this.#boardEdgeLimitX);
				console.log("WE'RE IN------------------------------------------------------------------------------------", futurePredX);
				// this.ballVelocityY = -this.ballVelocityY;
			}
			console.log("FUTTUREYYYYYYYYYYYYYYYYYYYYYY", futurePredY, "CURRENTYYYYYYYYYYYYYY", ballPosition.y);
			console.log("FUTTUREX", futurePredX, "CURRENTX", ballPosition.x);
			// console.log("here",this.ballPredX, ballPosition.x, this.ballPredY, ballPosition.y);
			this.distanceToBall = futurePredY - this.#threeJSGroup.position.y;
			// this.aiSpeed = 15;
			// console.log(this.aiSpeed)
			// if (Math.abs(this.ballPredY) > this.#boardEdgeLimit) {
			// 	AISpeed *= 0.9;
			// }
			if (Math.abs(this.distanceToBall) > movementThreshold) {
				let moveAmount = this.distanceToBall * smoothMove;
				moveAmount = Math.sign(moveAmount) * Math.min(Math.abs(moveAmount), maxSpeed);
				// console.log(moveAmount)
				const newYPosition = this.#threeJSGroup.position.y + moveAmount;
				this.#threeJSGroup.position.setY(newYPosition);
			}
			this.lastBallMovement = currentTime;
		}
		if ((this.flag == 0 && currentTime - this.startTime > 50) || (this.flag == 1 && currentTime - this.lastReactionTime > reactionDelay)) {
			this.flag = 1;
			this.ballVelocityX = velocity.x;
			this.ballVelocityY = velocity.y;
			this.ballPredX = ballPosition.x;
            this.ballPredY = ballPosition.y;
			this.lastBallMovement = currentTime;
			this.lastReactionTime = Date.now();
			// console.log(velocity.x, velocity.y)
			// console.log("here",this.ballPredX, ballPosition.x, this.ballPredY, ballPosition.y);

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
