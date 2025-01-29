import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { Player } from "./player/Player.js";
import { Ball } from "./Ball.js";
import { addLocalGame } from "../../../scripts/clients/gamelog-client.js";

export class Match {
	#engine;
	#threeJSGroup = new THREE.Group();
	#players = [null, null];
	ball;
	#ballIsWaiting;
	#ballStartTime;
	#pointsToWinMatch = 1;
	#matchIsOver = false;
	#points = [0, 0];

	constructor() { }

	async init(engine) {
		this.#engine = engine;
		// console.log("AI enabled:", engine.isAIGame);

		if (!engine.players || !Array.isArray(engine.players) || engine.players.length < 2) {
			throw new Error("Invalid or incomplete players data in engine.players");
		}

		// console.log("Engine players:", engine.players);

		this.ball = new Ball();
		this.#threeJSGroup.add(this.ball.threeJSGroup);

		this.#threeJSGroup.position.set(30, 23.75, 0);

		for (let i = 0; i < 2; i++) {
			try {
				const isAIControlled = engine.isAIGame && i === 1;
				const playerName = engine.players[i] || `Player ${i + 1}`;
				// console.log(`Initializing player ${i} with name: ${playerName}`);

				this.#players[i] = new Player(isAIControlled);
				await this.#players[i].init(i, this.#pointsToWinMatch, playerName);
				this.#threeJSGroup.add(this.#players[i].threeJSGroup);

				// console.log(`Player ${i} initialized successfully.`);
			} catch (error) {
				// console.error(`Failed to initialize player ${i}:`, error);
				this.#players[i] = null;
			}
		}

		// console.log("Final players array after initialization:", this.#players);

		this.prepareBallForMatch();
	}

	prepareBallForMatch() {
		this.#ballIsWaiting = true;
		this.#ballStartTime = Date.now() + 3000; // 3-second delay
		this.ball.prepareForMatch();

		this.#players.forEach((player, index) => {
			if (player) {
				player.resetPaddle();
				player.stopGame(); // Ensure paddles cannot move while waiting
			}
		});

		// console.log("Players have been reset for the next round.");
	}

	startGame() {
		this.#players.forEach((player) => {
			if (player) {
				player.startGame(); // Enable paddle movement when the game starts
			}
		});
	}

	updateFrame(timeDelta, currentTime, pongGameBox, boardSize) {
		const ballPosition = this.ball.getPosition();
		// console.log(ballPosition)
		this.#players.forEach((player, index) => {
			if (player) {
				player.updateFrame(timeDelta, pongGameBox, index === 1 ? ballPosition : null);
			}
		});

		if (!this.#matchIsOver) {
			if (this.#ballIsWaiting && currentTime >= this.#ballStartTime) {
				this.#ballIsWaiting = false;
				this.startGame(); // Start the game when the ball is ready
			}
			if (!this.#ballIsWaiting) {
				this.ball.updateFrame(timeDelta, boardSize, this);
			}
		}
	}
    prepareBallForMatch() {
        this.#ballIsWaiting = true;
        this.#ballStartTime = Date.now() + 3000; // 3-second delay
        this.ball.prepareForMatch();

        this.#players.forEach((player, index) => {
            if (player) {
                player.resetPaddle();
                player.stopGame(); // Ensure paddles cannot move while waiting
            }
        });

        console.log("Players have been reset for the next round.");
    }

    startGame() {
        this.#players.forEach((player) => {
            if (player) {
                player.startGame(); // Enable paddle movement when the game starts
            }
        });
    }

    updateFrame(timeDelta, currentTime, pongGameBox, boardSize) {
        const ballPosition = this.ball.getPosition();

        this.#players.forEach((player, index) => {
            if (player) {

                player.updateFrame(
                    timeDelta,
                    pongGameBox,
                    index === 1 ? ballPosition : null,
                    !this.#ballIsWaiting && !this.#matchIsOver // Only update if game is active
                );
            }
        });

        if (!this.#matchIsOver) {
            if (this.#ballIsWaiting && currentTime >= this.#ballStartTime) {
                this.#ballIsWaiting = false;
                this.startGame(); // Start the game when the ball is ready
            }
            if (!this.#ballIsWaiting) {
                this.ball.updateFrame(timeDelta, boardSize, this);
            }
        }
    }

	// if (this.gameType === "remote") {
	// 	console.log("Remote");
	// 	if (this.isHost) {
	// 		console.log("are we host??????!!!!!!")
	// 		// this.#engine.sendBallPosition(ballPosition);
	// 		sendWebSocketMessage({type:"ballPosition",position:ballPosition, gameSession:this.#engine.gameID});
	// 		// this.#ball.setPosition(receivedBallPosition);
	// 	}
	// 	// else {
	// 	// 	// If this is the opponent, update the ball's position from received data.
	// 	// 	const receivedBallPosition = this.#engine.getReceivedBallPosition();
	// 	// 	if (receivedBallPosition) {
	// 	// 		this.#ball.setPosition(receivedBallPosition);
	// 	// 	}
	// 	// }
	// }


	playerMarkedPoint(playerIndex) {
		this.#points[playerIndex]++;
		if (this.#players[playerIndex]) {
			this.#players[playerIndex].addPoint();
		} else {
			// console.error(`Player ${playerIndex} is null during scoring.`);
		}

		// console.log(`Score Update: Player 1: ${this.#points[0]}, Player 2: ${this.#points[1]}`);

		if (this.#points[playerIndex] >= this.#pointsToWinMatch) {
			this.endGame();
		} else {
			this.prepareBallForMatch();
		}
	}

	// async
	endGame() {
		this.#matchIsOver = true;
		this.ball.removeBall();
		this.#engine.component.addEndGameCard(this.#points[0], this.#points[1]);

		// const { error } = await addLocalGame({
		// 	my_score: this.#points[0],
		// 	opponent_score: this.#points[1],
		// 	opponent_username: this.#players[1].board.playerName,
		// });

		// if (error) {
		// 	// console.error("Failed to save game to gamelog");
		// }

		this.#players.forEach((player, index) => {
			if (player) {
				player.resetPaddle(); // Reset paddles at the end of the game
			} else {
				// console.error(`Player ${index} is null during reset at game end.`);
			}
		});

		// console.log("Game ended. Players reset to their initial positions.");
	}

	setBallMovement(movementJson) {
		this.ball.setMovement(movementJson);
	}

	setBallPosition(positionJson) {
		this.ball.setPosition(positionJson);
	}

	getPosition() {
		return this.#threeJSGroup.position;
	}

	get threeJSGroup() {
		return this.#threeJSGroup;
	}

	get players() {
		return this.#players;
	}

	get ball() {
		return this.ball;
	}

	get ballStartTime() {
		return this.ballStartTime;
	}
}
