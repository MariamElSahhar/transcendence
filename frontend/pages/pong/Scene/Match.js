import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { Player } from "./player/Player.js";
import { Ball } from "./Ball.js";
import {
	addLocalGame,
	addRemoteGame,
} from "../../../scripts/clients/gamelog-client.js";
import { isAuth } from "../../../scripts/utils/session-manager.js";
import { showError } from "../../error/ErrorPage.js";

export class Match {
	engine;
	#threeJSGroup = new THREE.Group();
	players = [null, null];
	ball;
	#ballIsWaiting;
	#ballStartTime;
	#pointsToWinMatch = window.APP_CONFIG.pointsToWinPongMatch;
	matchIsOver = false;
	gameStarted = false;
	#points = [0, 0];
	playersReady = true;

	constructor() {}

	async init(engine) {
		this.engine = engine;
		if (
			!engine.players ||
			!Array.isArray(engine.players) ||
			engine.players.length < 2
		) {
			throw new Error(
				"Invalid or incomplete players data in engine.players"
			);
		}

		this.ball = new Ball();
		this.#threeJSGroup.add(this.ball.threeJSGroup);

		this.#threeJSGroup.position.set(30, 23.75, 0);

		for (let i = 0; i < 2; i++) {
			try {
				const isAIControlled = engine.isAIGame && i === 1;
				const playerName = engine.players[i] || `Player ${i + 1}`;

				this.players[i] = new Player(isAIControlled);
				await this.players[i].init(
					i,
					this.#pointsToWinMatch,
					playerName
				);
				this.#threeJSGroup.add(this.players[i].threeJSGroup);
			} catch (error) {
				this.players[i] = null;
			}
		}

		if (this.engine.gameSession != -1) {
			this.gameType = "remote";
			if (this.engine.playerSide == "left") this.isHost = true;
			else this.isHost = false;
		} else this.gameType = "local";
		this.prepareBallForMatch();
	}

	startGame() {
		this.players.forEach((player) => {
			if (player) {
				player.startGame();
			}
		});
	}

	prepareBallForMatch() {
		this.#ballIsWaiting = true;
		this.#ballStartTime = Date.now() + 3000;
		if (this.gameType == "local" || this.ball.movementSet == false)
			this.ball.prepareForMatch(
				this.gameType,
				this.isHost,
				this.engine.gameSession
			);

		this.players.forEach((player) => {
			if (player) {
				player.resetPaddle();
				player.stopGame();
			}
		});
	}

	startGame() {
		if(this.engine.isAIGame)
			this.players[1].paddle.startTime = 0;
		this.players.forEach((player) => {
			if (player) {
				player.startGame();
			}
		});
	}

	setPosition(position) {
		this.setBallMovement(position);
	}

	updateFrame(timeDelta, currentTime, pongGameBox, boardSize) {
		const ballPosition = this.ball.getPosition();
		this.players.forEach((player, index) => {
			if (player) {
				player.updateFrame(
					timeDelta,
					pongGameBox,
					index === 1 ? ballPosition : null,
					!this.#ballIsWaiting && !this.matchIsOver,
					this.ball.movement
				);
			}
		});

		if (!this.matchIsOver) {
			if (
				this.gameStarted &&
				this.#ballIsWaiting &&
				currentTime >= this.#ballStartTime
			) {
				this.#ballIsWaiting = false;
				this.startGame();
			}
			if (!this.#ballIsWaiting) {
				this.setBallPosition(ballPosition);
				this.ball.updateFrame(timeDelta, boardSize, this);
			}
		}
	}

	startNewRound() {
		this.playersReady = false;
	}

	waitForPlayersToBeReady() {
		if (this.playersReady) {
			this.startNewRound();
			this.#ballStartTime = Date.now() + 3000;
			this.prepareBallForMatch();
		}
	}

	onPlayerReady() {
		this.playersReady = true;
		this.waitForPlayersToBeReady();
	}

	playerMarkedPoint(playerIndex) {
		this.#points[playerIndex]++;
		if (this.players[playerIndex]) {
			this.players[playerIndex].addPoint();
			let index = playerIndex == 1 ? 0 : 1;
			this.players[index].board.removeLife();
		} else {
		}
		if (this.#points[playerIndex] >= this.#pointsToWinMatch) {
			this.endGame();
		} else {
			let index = this.engine.playerSide == "left" ? 0 : 1;
			if (this.gameType == "remote") {
				this.#ballIsWaiting = true;
				this.#ballStartTime = Date.now() + 100000000;
				this.ball.movementSet = false;
				this.ball.prepareForMatch(
					this.gameType,
					this.isHost,
					this.engine.gameSession
				);
				this.waitForPlayersToBeReady();
			} else this.prepareBallForMatch();
		}
	}

	async endGame() {
		this.matchIsOver = true;
		this.ball.removeBall();
		this.engine.component.renderEndGameCard(
			this.#points[0],
			this.#points[1]
		);
		if (!(await isAuth())) window.redirect("/");
		if (this.gameType == "local") {
			const { error } = await addLocalGame({
				my_score: this.#points[0],
				opponent_score: this.#points[1],
				opponent_username: this.engine.players[1],
			});
		} else if (this.isHost) {
			const { error } = await addRemoteGame({
				opponent_score: this.#points[1],
				my_score: this.#points[0],
				opponent_username: this.engine.players[1],
			});
		}

		this.players.forEach((player, index) => {
			if (player) {
				player.stopGame();
				player.resetPaddle(); // Reset paddles at the end of the game
			} else {
				showError();
				console.error(
					`Player ${index} is null during reset at game end.`
				);
			}
		});
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
		return this.players;
	}

	get ball() {
		return this.ball;
	}

	get ballStartTime() {
		return this.ballStartTime;
	}
}
