import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { Segment2 } from "../Segment2.js";
export class Paddle {
	#threeJSGroup = new THREE.Group();
	#moveSpeed = 15;
	#movement = new THREE.Vector3(0, 0, 0);
	#boardEdgeLimit = 10;
	#lastReactionTime = 0; //Add this line to your private fields to track the last reaction time
	#isAIControlled = false; // AI control flag

	#paddleObject;
	#light;

	#topCollisionSegment;
	#frontCollisionSegment;
	#bottomCollisionSegment;

	#playerPosition;
	#paddleSize = new THREE.Vector3(1, 5, 1);
	#paddleIsOnTheRight;

	constructor(paddleIsOnTheRight, playerPosition, isAIControlled = false) {
		this.#paddleIsOnTheRight = paddleIsOnTheRight;
		this.#isAIControlled = isAIControlled;

		this.#threeJSGroup.position.set(paddleIsOnTheRight ? 8 : -8, 0, 0.501);

		const color = this.#getColor();
		this.#addPaddleToGroup(color);
		this.#addLightToGroup(color);

		this.#playerPosition = playerPosition;

		this.#setCollisionSegments();
	}

	updateFrame(timeDelta, paddleBoundingBox, ballPosition = null) {
		if (this.#isAIControlled && ballPosition) {
			this.#moveAIPaddle(ballPosition);
		} else {
			const movement = new THREE.Vector3()
				.copy(this.#movement)
				.multiplyScalar(timeDelta);
			this.#threeJSGroup.position.add(movement);
		}

		// Paddle boundary enforcement
		this.#constrainPaddle(paddleBoundingBox);
		this.#setCollisionSegments();
	}

	#moveAIPaddle(ballPosition, ballVelocity) {
		const reactionDelay = 50; // Reduced delay for faster reaction
		const currentTime = Date.now();

		// Only update the AI's position if the reaction delay has passed
		if (currentTime - this.#lastReactionTime < reactionDelay) {
			return; // Exit if delay has not passed, skipping this frame
		}
		this.#lastReactionTime = currentTime; // Update last reaction time

		// Predict ball's position slightly ahead if ballVelocity is available
		const anticipationFactor = 0.3; // Adjust to make the AI anticipate further or less
		const anticipatedPositionY =
			ballPosition.y + (ballVelocity?.y || 0) * anticipationFactor;
		const distanceToBall =
			anticipatedPositionY - this.#threeJSGroup.position.y;

		// Smooth movement: Increase speed based on distance, capped at a max speed
		const maxAISpeed = 3.5;
		let aiSpeed = Math.min(maxAISpeed, Math.abs(distanceToBall) * 0.15);

		// If the ball is close to an edge, reduce the AI’s speed to simulate human difficulty with edge shots
		if (Math.abs(anticipatedPositionY) > this.#boardEdgeLimit) {
			aiSpeed *= 0.8; // Slow down by 20% near edges
		}

		// Random miss factor: Occasionally make the AI hesitate, giving the player a chance to score
		const missChance = 0.05; // 5% chance of skipping a move to simulate error
		if (Math.random() < missChance) {
			return; // AI misses this frame, adding a slight random challenge
		}

		// Gradually move AI paddle up or down toward the anticipated position
		const movementThreshold = 0.1; // Minimum distance to move to avoid jitter
		if (Math.abs(distanceToBall) > movementThreshold) {
			// Calculate the new y-position for the AI paddle
			const newYPosition =
				this.#threeJSGroup.position.y +
				(distanceToBall > 0 ? aiSpeed : -aiSpeed);

			// Use setY to update only the y-component of the position vector
			this.#threeJSGroup.position.setY(newYPosition);
		}
	}

	// #moveAIPaddle(ballPosition) {
	//   const reactionDelay = 40; // Reduced delay to make AI react faster
	//   const currentTime = Date.now(); // Get the current time in milliseconds

	//   // Check if enough time has passed since the last reaction
	//   if (currentTime - this.#lastReactionTime < reactionDelay) {
	//       return; // If delay has not passed, exit early and do not move the paddle
	//   }
	//   this.#lastReactionTime = currentTime; // Update the last reaction time to the current time

	//   // Calculate the distance between the ball and the AI paddle along the y-axis
	//   const distanceToBall = ballPosition.y - this.#threeJSGroup.position.y;

	//   // Calculate the AI speed based on the distance to the ball
	//   // Slightly increase the multiplier to make the AI move faster
	//   //let aiSpeed = Math.min(3.5, Math.abs(distanceToBall) * 0.12); // Increased speed multiplier
	//   let aiSpeed = Math.min(4.0, Math.abs(distanceToBall) * 0.15);

	//   // Reduce the slowdown effect near edges to make AI more accurate
	//   if (Math.abs(ballPosition.y) > this.#boardEdgeLimit) {
	//       aiSpeed *= 0.9; // Only slow down by 20% near edges for better tracking
	//   }

	//   // Move the AI paddle up or down depending on the ball’s position relative to the paddle
	//   if (distanceToBall > 0) {
	//       this.#threeJSGroup.position.y += aiSpeed; // Move paddle up if ball is above
	//   } else if (distanceToBall < 0) {
	//       this.#threeJSGroup.position.y -= aiSpeed; // Move paddle down if ball is below
	//   }
	// }

	#constrainPaddle(paddleBoundingBox) {
		if (this.#threeJSGroup.position.y < paddleBoundingBox.y_min) {
			this.#threeJSGroup.position.y = paddleBoundingBox.y_min;
		} else if (this.#threeJSGroup.position.y > paddleBoundingBox.y_max) {
			this.#threeJSGroup.position.y = paddleBoundingBox.y_max;
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
		this.#paddleObject.position.set(0, 0, 0.25);
		this.#threeJSGroup.add(this.#paddleObject);
	}

	#addLightToGroup(color) {
		this.#light = new THREE.PointLight(color, 20, 10);
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

		this.#topCollisionSegment = new Segment2(topLeft, topRight);
		this.#bottomCollisionSegment = new Segment2(bottomLeft, bottomRight);
		this.#frontCollisionSegment = this.#paddleIsOnTheRight
			? new Segment2(bottomLeft, topLeft)
			: new Segment2(bottomRight, topRight);
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
