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
import {
	renderCountdownCard,
	renderEndGameCard,
	renderOpponentFoundCard,
	renderPlayerDisconnectedCard,
} from "./Overlays.js";

export class RemoteGamePage extends Component {
	constructor() {
		super();
		this.container;
		this.data;
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
		this.data = data;
		if (data["message"] === "Match found!" && !this.playerSet)
			this.matchFound();
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
			this.startRound();
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
					<h4 id="status">Waiting for an opponent</h4>
				</div>
			</div>
		</div>
		`;
	}

	style() {
		return `
		<style>
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

	matchFound() {
		this.gameID = this.data.game_session_id;
		this.playerSet = true;
		this.sameSystem = this.data.sameSystem;
		this.playerSide = this.data.position == "left" ? "right" : "left";
		this.playerNames =
			this.data.position == "left"
				? [this.data.player, getUserSessionData().username]
				: [getUserSessionData().username, this.data.player];
		clearTimeout(this.timeoutID);
		this.container.innerHTML = "";
		renderOpponentFoundCard(this, this.playerNames[0], this.playerNames[1]);
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
				}
			} else {
				console.error(
					"WebGL not supported:",
					WebGL.getWebGLErrorMessage()
				);
			}
		}, 3000);
	}

	startRound() {
		if (this.data.round == 1) {
			renderCountdownCard(this.container, this.engine);
		} else {
			this.engine.scene.match.onPlayerReady(this.data.index);
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
		renderPlayerDisconnectedCard(this);
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
		await removeMatchMaking();
	}

	async waitForOpponent() {
		this.timeoutID = this.setTrackedTimeout(() => {
			document.getElementById("status").innerHTML =
				"No opponent found. Please try again later!";
			this.removeFromMatchmaking();
		}, 180000);
		const { status } = await matchMaker(this.getCanvasFingerprint());
		if (status == 400) {
			document.getElementById("status").innerHTML =
				"You're already in the queue!";
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

	renderEndGameCard(playerScore, opponentScore) {
		renderEndGameCard(this, this.playerNames, [playerScore, opponentScore]);
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
