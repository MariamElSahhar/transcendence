import { Component } from "../Component.js";
import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";
import { Engine } from "./Engine.js";
import { getUserSessionData } from "../../scripts/utils/session-manager.js";

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

	disconnectedCallback() {
		if (this.engine) {
			this.engine.stopAnimationLoop();
			this.engine.cleanUp();
		}
		if (this.countDownIntervalId) {
			clearInterval(this.countDownIntervalId);
			this.countDownIntervalId = null;
		}
	}

	render() {
		return `
			<div id="container" class="d-flex justify-content-center align-items-center w-100 h-100">
				${
					this.isAIEnabled
						? `<div class="p-3 card shadow p-5 mx-auto rounded bg-light">
							<h2 class="w-100 text-center">${getUserSessionData().username} vs. Computer</h2>
							<button id="start-game" type="submit" class="btn w-100">Go!</button>
						</div>`
						: `<div id="player-setup" class="p-3 card shadow p-5 mx-auto rounded bg-light">
							<h2 class="w-100 text-center">Setup Players</h2>
							<form id="player-form"  class="d-flex flex-column gap-2">
								<input type="text" class="form-control w-100 text-dark" placeholder="${
									getUserSessionData().username
								}" disabled/>
								<input type="text" id="player2-name" name="player2-name" class="form-control w-100 text-dark" placeholder="Player 2 display name"/>
								<button id="start-game" type="submit" class="btn w-100"  disabled>Start Game</button>
							</form>
						</div>`
				}
			</div>
        `;
	}

	postRender() {
		const startGameButton = this.querySelector("#start-game");
		this.container = this.querySelector("#container");
		let player2NameInput;
		if (!this.isAIEnabled) {
			player2NameInput = this.querySelector("#player2-name");

			player2NameInput.addEventListener("input", () => {
				if (player2NameInput.value) {
					startGameButton.removeAttribute("disabled");
				} else {
					startGameButton.setAttribute("disabled", "");
				}
			});
		}

		startGameButton.addEventListener("click", (event) => {
			event.preventDefault();
			this.playerNames = [this.playerNames[0]];
			const player2Name = this.isAIEnabled
				? "Computer"
				: player2NameInput.value;
			this.playerNames.push(player2Name || "Player 2");

			this.querySelector("#container").innerHTML = "";

			if (WebGL.isWebGLAvailable()) {
				this.engine = new Engine(
					this,
					this.isAIEnabled,
					this.playerNames
				);
				this.engine.createScene();
				this.renderCountdownCard();
				this.startCountdown();
			} else {
				console.error(
					"WebGL not supported:",
					WebGL.getWebGLErrorMessage()
				);
			}
		});
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

	renderCountdownCard() {
		this.renderOverlay();
		this.overlay.innerHTML = `
          <div class="card text-center text-dark bg-light" style="width: 30rem;">
            <div class="card-body">
              <h1 id="countdown" class="display-1 fw-bold">5</h1>
			  <img src="/pages/tictactoe/shroom.png" alt="Game Icon" class="card-image">
            </div>
          </div>
        `;
	}

	renderEndGameCard(playerScore, opponentScore) {
		const playerName = this.playerNames[0];
		const opponentName = this.playerNames[1];

		this.renderOverlay();
		this.overlay.innerHTML = `
        <div id="end-game-card" class="card text-center border-warning text-dark bg-light" style="max-width: 30rem;">

          <div class="card-body">
		  <h1 class="card-title text-success">Game Over</h1>
            <h5 class="card-subtitle mb-3 text-muted">Final Score</h5>
			<img src="/pages/tictactoe/shroom.png" alt="Game Icon" class="card-image">

            <div class="d-flex justify-content-center align-items-center mb-4">
              <div class="text-center me-3" style="width:120px">
                <h4 class="fw-bold text-truncate text-primary text-center" style="max-width: 150px;">${playerName}</h4>
                <p class="display-6 fw-bold text-center" style="max-width: 150px;">${playerScore}</p>
              </div>
              <div class="text-center ms-3" style="width:120px">
                <h4 class="fw-bold text-truncate text-danger text-center" style="max-width: 150px;">${opponentName}</h4>
                <p class="display-6 fw-bold text-center" style="max-width: 150px;">${opponentScore}</p>
              </div>
            </div>
            <button class="btn btn-primary mt-3" onclick="window.location.href='/home'">Go Home</button>
          </div>
        </div>
      `;
	}

	renderOverlay() {
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
		this.container.appendChild(this.overlay);
	}

	removeOverlay() {
		if (this.overlay) {
			this.overlay.remove();
			this.overlay = null;
		}
	}
}

customElements.define("local-game-page", LocalGamePage);
