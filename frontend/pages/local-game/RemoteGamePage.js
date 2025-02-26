import { Component } from "../Component.js";
import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";
import { Engine } from "./Engine.js";
import { getUserSessionData } from "../../scripts/utils/session-manager.js";
import {
	matchMaker,
	removeMatchMaking,
} from "../../scripts/clients/gamelog-client.js";
import {
	initializeWebSocket,
	sendWebSocketMessage,
	closeWebSocket,
} from "../../scripts/utils/websocket-manager.js";
import { renderEndGameCard, renderOpponentFoundCard } from "./Overlays.js";

export class RemoteGamePage extends Component {
	constructor() {
		super();
		this.container = null;
		this.engine = null;
		this.overlay = null;
		this.playerNames = []; // Stores player names
		this.scores = [0, 0]; // Tracks scores for both players
		this.isAIEnabled = false;
		this.playerSet = false;
		this.playerLeft = false;
		this.activeTimeouts = new Set();
	}

	connectedCallback() {
		// this.socket = new WebSocket(`ws://${window.location.host}:8000/ws/game/`);
		// this.keyHandler = new KeyHandler(this);

		initializeWebSocket(
			`/ws/game/`,
			this.onWebSocketOpen.bind(this),
			this.onWebSocketMessage.bind(this),
			this.onWebSocketClose.bind(this),
			this.onWebSocketError.bind(this)
		);
		super.connectedCallback();
	}

	onWebSocketOpen(socket) {
		this.waitForOpponent();
	}

	onWebSocketMessage(data) {
		if (data["message"] === "Match found!" && !this.playerSet)
			this.match_found(data);
		else if (data["message"] == "Move slab") {
			const event = { key: data["key"] };
			if (data["keytype"] == "keydown")
				this.engine.keyHookHandler.handleKeyPress(event);
			else if (data["keytype"] == "keyup")
				this.engine.keyHookHandler.handleKeyRelease(event);
		} else if (data["message"] == "Move ball")
			this.engine.scene.match.ball.setMovement(data["position"]);
		else if (data["message"] == "Update positions") {
			if (this.playerSide == "right") {
				this.engine.scene.match.ball.setPosition(data["ball"]);
				this.engine.scene.match.players[0].paddle.setPosition(
					data["leftpaddle"]
				);
				this.engine.scene.match.players[1].paddle.setPosition(
					data["rightpaddle"]
				);
			}
		} else if (data["message"] == "startRound") {
			this.start_round(data);
		} else if (data["message"] == "endgame") {
			if (!this.engine.scene.match.isHost)
				this.engine.scene.match.playerMarkedPoint(data["index"]);
		} else if (data["message"] == "opponent_left") this.player_left();
	}

	onWebSocketClose() {
		console.log("WebSocket closed");
	}

	onWebSocketError(error) {
		console.error("WebSocket error:", error);
	}

	render() {
		return `
		<div id="container" class="m-2 position-relative">
			<div id="searchdiv" class="d-flex justify-content-center align-items-center h-100">
				<div id="searchBox" class="card p-4 bg-light d-flex flex-column justify-content-center align-items-center gap-3">
					<img id="search-icon" src="/assets/question.png" class="h-auto"/>
					<h4 class="mb-3 heading">Waiting for an opponent</h4>
				</div>
			</div>
		</div>
		`;
	}

	style() {
		return `
		<style>
			.match-container {
				display: flex;
				align-items: center; /* Vertically aligns the items */
				justify-content: center; /* Centers the content horizontally */
			}

			.avatar-container {
				display: flex;
				flex-direction: column; /* Arranges the avatar and username vertically */
				align-items: center; /* Centers the avatar and username */
				margin: 10px; /* Adds space between avatars */
			}

			.avatar {
				width: 50px; /* Set the size of the avatar */
				height: 50px; /* Ensure it's circular */
				border-radius: 50%; /* Makes the avatar a circle */
				object-fit: cover; /* Ensures the image covers the circle */
			}

			#search-icon {
				width: 50px;
				animation: rotateCube 2s linear infinite;
  				transform-origin: center;
			}

			@keyframes rotateCube {
				0% {
					transform: rotateY(0deg);
				}
				100% {
					transform: rotateY(360deg);
				}
			}

			.player-container {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 100%; /* Ensure equal height */
			}

			.username {
				margin-top: 5px; /* Adds space between avatar and username */
				font-size: 14px;
				text-align: center;
				min-width: 100px; /* Set a minimum width for the username */
			}
		</style>`;
	}

	postRender() {
		this.container = this.querySelector("#container");
		window.addEventListener("beforeunload", (event) => {
			if (!this.engine || !this.engine.scene.match.matchIsOver)
				sendWebSocketMessage({
					action: "leavingMatch",
					gameSession: this.gameID,
				});
		});
	}

	setTrackedTimeout(callback, delay) {
		const timeoutID = setTimeout(() => {
			callback();
			this.activeTimeouts.delete(timeoutID); // Remove timeout ID after execution
		}, delay);
		this.activeTimeouts.add(timeoutID); // Add timeout ID to the set
		return timeoutID;
	}

	match_found(data) {
		this.gameID = data["game_session_id"];
		this.playerSet = true;
		this.sameSystem = data["sameSystem"];
		this.playerSide = data.position == "left" ? "right" : "left";
		this.playerNames =
			data.position == "left"
				? [data.player, getUserSessionData().username]
				: [getUserSessionData().username, data.player];
		clearTimeout(this.timeoutID);
		renderOpponentFoundCard(this);
		this.timeoutID = this.setTrackedTimeout(() => {
			if (WebGL.isWebGLAvailable()) {
				this.container.innerHTML = "";
				this.engine = new Engine(
					this,
					this.isAIEnabled,
					this.playerNames,
					this.playerSide,
					this.gameID,
					this.sameSystem
				);
				this.engine.createScene();
				if (!this.playerLeft) {
					sendWebSocketMessage({
						action: "ready",
						gameSession: this.gameID,
					});
					this.createOverlay();
				}
			} else {
				console.error(
					"WebGL not supported:",
					WebGL.getWebGLErrorMessage()
				);
			}
		}, window.APP_CONFIG.gameCountdown * 1000);
	}

	start_round(data) {
		if (data["round"] == 1) {
			const countdownStart =
				Date.now() / 1000 + window.APP_CONFIG.gameCountdown;
			this.startCountdown(countdownStart);
		} else {
			this.engine.scene.match.onPlayerReady(data["index"]);
		}
	}

	player_left() {
		this.playerLeft = true;
		if (this.engine) {
			this.engine.stopAnimationLoop();
			this.engine.cleanUp();
		}
		if (this.countDownIntervalId) {
			clearInterval(this.countDownIntervalId);
			this.countDownIntervalId = null;
		}
		if (this.engine) {
			this.engine.scene.match.matchIsOver = true;
			if (this.engine.scene.match.ball)
				this.engine.scene.match.ball.removeBall();
		}
		this.addPlayerLeftCard();
	}

	async disconnectedCallback() {
		try {
			if (!this.engine || !this.engine.scene.match.matchIsOver)
				sendWebSocketMessage({
					action: "leavingMatch",
					gameSession: this.gameID,
				});
			const { status, success, data } = await removeMatchMaking();
			closeWebSocket();
			if (success) {
			} else {
				console.warn(
					"Failed to remove from matchmaking queue. Status:",
					status
				);
			}
			if (this.timeoutID) {
				clearTimeout(this.timeoutID);
				this.timeoutID = null; // Reset the global variable
			}
		} catch (error) {
			console.error(
				"Error while removing from matchmaking queue:",
				error
			);
		}
		this.activeTimeouts.forEach((timeoutID) => {
			clearTimeout(timeoutID);
		});
		this.activeTimeouts.clear();
		if (this.engine) {
			this.engine.stopAnimationLoop();
			this.engine.cleanUp();
		}
		if (this.countDownIntervalId) {
			clearInterval(this.countDownIntervalId);
			this.countDownIntervalId = null;
		}
		super.disconnectedCallback();
	}

	async removeFromMatchmaking() {
		const { status, success, data } = await removeMatchMaking();
		console.log(status, success, data);
	}

	async waitForOpponent() {
		this.timeoutID = this.setTrackedTimeout(() => {
			const stat = document.getElementById("statusmsg");
			const searchBox = document.getElementById("searchBox");
			searchBox.querySelector(".heading").innerHTML = "We're sorry! :(";
			stat.innerHTML = "No opponent found. Please try again later!";
			this.removeFromMatchmaking();
		}, 180000);
		const { status, success, data } = await matchMaker(
			this.getCanvasFingerprint()
		);
		if (status == 400) {
			const status = document.getElementById("statusmsg");
			const searchBox = document.getElementById("searchBox");
			searchBox.querySelector(".heading").innerHTML =
				"You're already in the queue!";
			status.innerHTML = "";
			return;
		}
	}

	async startGame() {
		this.engine.startGame();
		this.removeOverlay();
	}

	updateScore(playerIndex) {
		if (playerIndex < this.scores.length) {
			this.scores[playerIndex] += 1;
			console.log(
				`Player ${playerIndex} scored! Current score: ${this.scores[playerIndex]}`
			);
		} else {
			console.error("Invalid player index:", playerIndex);
		}
	}

	startCountdown(startDateInSeconds) {
		let secondsLeft = Math.round(startDateInSeconds - Date.now() / 1000);
		this.updateOverlayCountdown(secondsLeft);
		this.countDownIntervalId = setInterval(() => {
			secondsLeft -= 1;
			this.updateOverlayCountdown(secondsLeft);

			if (secondsLeft <= 0) {
				clearInterval(this.countDownIntervalId);
				this.countDownIntervalId = null;
				this.startGame();
			}
		}, 1000);
	}

	createOverlay() {
		this.overlay = document.createElement("div");
		this.overlay.id = "game-overlay";
		this.overlay.classList.add(
			"position-fixed",
			"top-0",
			"start-0",
			"w-100",
			"h-100",
			"d-flex",
			"justify-content-center",
			"align-items-center",
			"bg-dark",
			"bg-opacity-75",
			"text-white"
		);
		this.overlay.style.zIndex = "9999";
		this.overlay.innerHTML = `
				  <div class="card text-center text-dark bg-light" style="width: 18rem;">
					<div class="card-body">
					<h1 id="countdown" class="display-1 fw-bold">5</h1>
					<p class="card-text">Get ready! The game will start soon.</p>
					</div>
					</div>
					`;
		this.container.appendChild(this.overlay);
	}

	updateOverlayCountdown(secondsLeft) {
		const countdownElement = this.overlay.querySelector("#countdown");
		if (countdownElement) {
			countdownElement.textContent = secondsLeft;
		}
	}

	removeOverlay() {
		if (this.overlay) {
			this.overlay.remove();
			this.overlay = null;
		}
	}

	renderEndGameCard(playerScore, opponentScore) {
		renderEndGameCard(this, this.playerNames, [playerScore, opponentScore]);
	}

	addEndGameCard(playerScore, opponentScore) {
		const playerName = this.playerNames[0];
		const opponentName = this.playerNames[1];

		this.createOverlay();
		this.overlay.innerHTML = `
				<div id="end-game-card" class="card text-center text-dark bg-light" style="max-width: 24rem;">
				  <div class="card-header">
					<h1 class="card-title text-success">Game Over</h1>
				  </div>
				  <div class="card-body">
					<h5 class="card-subtitle mb-3 text-muted">Final Score</h5>
					<div class="d-flex justify-content-center align-items-center mb-4">
					  <div class="text-center me-3">
						<h6 class="fw-bold text-truncate" style="max-width: 100px;">${playerName}</h6>
						<p class="display-6 fw-bold">${playerScore}</p>
						</div>
						<div class="px-3 display-6 fw-bold align-self-center">:</div>
					  <div class="text-center ms-3">
					  <h6 class="fw-bold text-truncate" style="max-width: 100px;">${opponentName}</h6>
					  <p class="display-6 fw-bold">${opponentScore}</p>
					  </div>
					  </div>
					<button class="btn btn-primary mt-3" onclick="window.redirect('/home')">Go Home</button>
					</div>
					</div>
					`;
	}

	getCanvasFingerprint() {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		ctx.textBaseline = "top";
		ctx.font = "14px Arial";
		ctx.fillText("Unique Canvas Fingerprint", 2, 2);
		return canvas.toDataURL();
	}
}

customElements.define("remote-game-page", RemoteGamePage);
