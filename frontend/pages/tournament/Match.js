import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { Player } from "../pong/Scene/player/Player.js";
import { Ball } from "../pong/Scene/Ball.js";

export class Match {
	#engine;
	#threeJSGroup = new THREE.Group();
	#players = [null, null];
	#ball;
	#ballIsWaiting;
	#ballStartTime;
	gameStarted = false;
	#pointsToWinMatch;
	#matchIsOver = false;
	#points = [0, 0];
	#matchID;
	#playerNames;
	#onMatchEndCallback;

	constructor(
		matchID,
		playerNames,
		pointsToWinMatch = window.APP_CONFIG.pointsToWinPongMatch,
		onMatchEndCallback = null
	) {
		this.gameType = "local";
		this.#matchID = matchID;
		this.#playerNames = playerNames || ["Player 1", "Player 2"];
		this.#pointsToWinMatch = pointsToWinMatch;
		this.#onMatchEndCallback = onMatchEndCallback;
	}

	async init(engine) {
		this.#engine = engine;

		this.#ball = new Ball();
		this.prepareBallForMatch();
		this.#threeJSGroup.add(this.#ball.threeJSGroup);

		this.#threeJSGroup.position.set(30, 23.75, 0);

		for (let i = 0; i < 2; i++) {
			const playerName = this.#playerNames[i] || `Player ${i + 1}`;
			this.#players[i] = new Player();
			await this.#players[i].init(i, this.#pointsToWinMatch, playerName);
			this.#threeJSGroup.add(this.#players[i].threeJSGroup);

			this.#players[i].resetPaddle();
			this.#players[i].stopGame();
		}
	}

	updateFrame(timeDelta, currentTime, pongGameBox, boardSize) {
		this.#players.forEach((player, index) => {
			if (player) {
				player.updateFrame(
					timeDelta,
					pongGameBox,
					index === 1 ? this.#ball.getPosition() : null,
					!this.#ballIsWaiting && !this.#matchIsOver
				);
			}
		});

		if (!this.#matchIsOver) {
			if (
				this.gameStarted &&
				this.#ballIsWaiting &&
				currentTime >= this.#ballStartTime
			) {
				this.#ballIsWaiting = false;
				this.startGame();
			}

			if (!this.#ballIsWaiting) {
				this.#ball.updateFrame(timeDelta, boardSize, this);
			}
		}
	}

	startGame() {
		this.#players.forEach((player) => {
			if (player) {
				player.startGame();
			}
		});
	}

	stopGame() {
		this.#players.forEach((player) => {
			if (player) {
				player.stopGame();
			}
		});
	}

	prepareBallForMatch() {
		this.#ballIsWaiting = true;
		this.#ballStartTime = Date.now() + 3000;
		this.#ball.prepareForMatch();
		this.#players.forEach((player) => {
			if (player) {
				player.resetPaddle();
				player.stopGame();
			}
		});
	}

	playerMarkedPoint(playerIndex) {
		this.#points[playerIndex]++;
		this.#players[playerIndex].addPoint();
		let index = playerIndex == 1 ? 0 : 1;
		this.players[index].board.removeLife();
		if (this.#points[playerIndex] >= this.#pointsToWinMatch) {
			this.#matchIsOver = true;
			this.#ball.removeBall();

			const winnerName = this.#playerNames[playerIndex];

			if (this.#engine.getComponent().addEndGameCard) {
				this.#engine
					.getComponent()
					.addEndGameCard(this.#points[0], this.#points[1]);
			}

			if (this.#onMatchEndCallback) {
				this.#onMatchEndCallback(
					winnerName,
					this.#points[0],
					this.#points[1]
				);
			}
			this.stopGame();

			this.#players.forEach((player) => {
				if (player) {
					player.resetPaddle();
				}
			});

			return;
		}

		this.prepareBallForMatch();
	}

	resetMatch() {
		this.#points = [0, 0];
		this.#matchIsOver = false;

		this.#players.forEach((player) => {
			if (player) {
				player.resetPaddle();
				player.resetPoints();
				player.stopGame();
			}
		});

		this.prepareBallForMatch();
	}

	getWinner() {
		if (this.#matchIsOver) {
			return this.#points[0] >= this.#pointsToWinMatch
				? this.#playerNames[0]
				: this.#playerNames[1];
		}
		return null;
	}

	setBallMovement(movementJson) {
		this.#ball.setMovement(movementJson);
	}

	setBallPosition(positionJson) {
		this.#ball.setPosition(positionJson);
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
		return this.#ball;
	}

	get ballStartTime() {
		return this.#ballStartTime;
	}

	get matchID() {
		return this.#matchID;
	}

	get playerNames() {
		return this.#playerNames;
	}
}
