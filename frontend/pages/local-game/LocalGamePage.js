import { Component } from "../Component.js";
import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";
import { Engine } from "./Engine.js";
import { getUserSessionData } from "../../scripts/utils/session-manager.js";
import { renderOverlay, renderEndGameCard } from "./Overlays.js";

export class LocalGamePage extends Component {
	constructor() {
		super();
		this.container = null;
		this.engine = null;
		this.overlay = null;
		this.playerNames = []; // Stores player names
		this.scores = [0, 0]; // Tracks scores for both players
		this.isAIEnabled = window.location.pathname.endsWith("/single-player");
	}

	connectedCallback() {
		this.playerNames.push(getUserSessionData().username || "player 1");
		super.connectedCallback();
	}

	renderEndGameCard(playerScore, opponentScore) {
		renderEndGameCard(this.overlay, playerScore, opponentScore);
	}

	disconnectedCallback() {
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

	render() {
		return `
			<div id="container" class="d-flex justify-content-center align-items-center w-100 h-100">
				${
					this.isAIEnabled
						? `<p>hey</p>`
						: `<div id="player-setup" class="p-3 card shadow p-5 mx-auto rounded bg-light">
							<h2 class="w-100 text-center">Setup Players</h2>
							<form id="player-form"  class="d-flex flex-column gap-2">
								<input type="text" class="form-control w-100 text-dark" placeholder="${
									getUserSessionData().username
								}" disabled/>
								<input type="text" id="player2-name" name="player2-name" class="form-control w-100 text-dark" placeholder="Player 2 display name"/>
								<button id="submit-players" type="submit" class="btn w-100"  disabled>Start Game</button>
							</form>
						</div>`
				}
			</div>
        `;
	}

	postRender() {
		this.container = this.querySelector("#container");
		if (!this.isAIEnabled) {
			const startGameButton = this.querySelector("#submit-players");
			const player2NameInput = this.querySelector("#player2-name");

			player2NameInput.addEventListener("input", () => {
				if (player2NameInput.value) {
					startGameButton.removeAttribute("disabled");
				} else {
					startGameButton.setAttribute("disabled", "");
				}
			});

			startGameButton.addEventListener("click", (event) => {
				event.preventDefault();
				const player2Name = player2NameInput.value;
				this.playerNames.push(player2Name || "Player 2");

				this.container.innerHTML = "";

				if (WebGL.isWebGLAvailable()) {
					this.engine = new Engine(
						this,
						this.isAIEnabled,
						this.playerNames
					);
					this.engine.createScene();
					this.renderGameInfoCard();
				} else {
					console.error(
						"WebGL not supported:",
						WebGL.getWebGLErrorMessage()
					);
				}
			});
		} else {
			this.playerNames.push("Computer");

			this.container.innerHTML = "";

			setTimeout(() => {
				if (WebGL.isWebGLAvailable()) {
					this.engine = new Engine(
						this,
						this.isAIEnabled,
						this.playerNames
					);
					this.engine.createScene();
					this.renderGameInfoCard();
				} else {
					console.error(
						"WebGL not supported:",
						WebGL.getWebGLErrorMessage()
					);
				}
			}, 5);
		}
	}

	updateScore(playerIndex) {
		if (playerIndex < this.scores.length) this.scores[playerIndex] += 1;
	}

	startCountdown() {
		const startDateInSeconds = Date.now() / 1000 + 3;
		let secondsLeft = Math.round(startDateInSeconds - Date.now() / 1000);
		this.overlay.querySelector("#countdown").textContent = secondsLeft;

		this.countDownIntervalId = setInterval(() => {
			secondsLeft -= 1;
			this.overlay.querySelector("#countdown").textContent = secondsLeft;

			if (secondsLeft <= 0) {
				clearInterval(this.countDownIntervalId);
				this.countDownIntervalId = null;
				this.engine.startGame();
				this.removeOverlay();
			}
		}, 1000);
	}

	renderGameInfoCard() {
		this.overlay = renderOverlay(this.container);
		this.overlay.innerHTML = `
          <div class="card text-center">
            <div class="card-body">
				<h2>${this.playerNames[0]} vs ${this.playerNames[1]}</h2>
				<button id="start-game" class="btn w-100">Go!</button>
            </div>
          </div>
        `;
		super.addComponentEventListener(
			this.querySelector("#start-game"),
			"click",
			() => {
				this.removeOverlay();
				this.renderCountdownCard();
			}
		);
	}

	renderCountdownCard() {
		this.overlay = renderOverlay(this.container);
		this.overlay.innerHTML = `
			<h1 id="countdown" class="display-1 fw-bold">5</h1>
        `;
		this.startCountdown();
	}

	style() {
		return `
		<style>
			#winner-sprite {
				height: 56px;
			}
		</style>
		`;
	}

	removeOverlay() {
		if (this.overlay) {
			this.overlay.remove();
			this.overlay = null;
		}
	}
}

customElements.define("local-game-page", LocalGamePage);
