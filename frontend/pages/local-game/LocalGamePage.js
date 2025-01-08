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
		this.isAIEnabled = false;
	}

	connectedCallback() {
		// const userData = getUserSessionData();
		// const firstPlayerName = userData.username || "Player 1";
		// this.playerNames.push(firstPlayerName);
		this.playerNames.push(getUserSessionData().username || "player 1");

		this.innerHTML = `
            <div id="player-setup" class="p-3 border rounded bg-light" style="max-width: 400px; margin: 40px auto 0;">
              <h3 class="text-center">Setup Players</h3>
              <form id="player-form">
				<div id="player-names">
                  <div class="mb-3">
                    <label for="player2-name" class="form-label d-block"></label>
                    <input type="text" id="player2-name" name="player2-name" class="form-control mx-0 w-100" placeholder="Player 2 display name"/>
                  </div>
                </div>
				<div class="form-check mb-3">
                  <input type="checkbox" class="form-check-input" id="play-against-ai">
                  <label class="form-check-label" for="play-against-ai">Play against computer</label>
                </div>
                <button id="submit-players" type="submit" class="btn btn-primary mt-3 w-100" disabled>Start Game</button>
              </form>
            </div>
            <div id="container" class="m-2 position-relative" style="display:none;"></div>
        `;

		this.container = this.querySelector("#container");
		this.setupPlayerForm();
	}

	setupPlayerForm() {
		const form = this.querySelector("#player-form");
		const submit = this.querySelector("#submit-players");
		const AICheckbox = this.querySelector("#play-against-ai");
		const player2NameInput = this.querySelector("#player2-name");

		AICheckbox.addEventListener("change", () => {
			if (AICheckbox.checked) {
				player2NameInput.setAttribute("disabled", "");
				player2NameInput.value = "Computer";
				submit.removeAttribute("disabled");
			} else {
				player2NameInput.removeAttribute("disabled");
				submit.setAttribute("disabled", "");
				player2NameInput.value = "";
			}
		});

		player2NameInput.addEventListener("input", () => {
			if (player2NameInput.value) {
				submit.removeAttribute("disabled");
			} else {
				submit.setAttribute("disabled", "");
			}
		});

		form.addEventListener("submit", (event) => {
			event.preventDefault();

			// const userData = getUserSessionData();
			// console.log("User data:", userData);

			// const firstPlayerName = userData.username || "Player 1";
			// this.playerNames = [firstPlayerName];

			// const player2Name = AICheckbox.checked ? "Computer" : player2NameInput.value.trim();
			// this.playerNames.push(player2Name || "Player 2");
			this.playerNames = [this.playerNames[0]];

			const player2Name = AICheckbox.checked
				? "Computer"
				: player2NameInput.value;
			this.playerNames.push(player2Name || "Player 2");

			console.log("Players after form submission:", this.playerNames);

			this.isAIEnabled = AICheckbox.checked;

			this.querySelector("#player-setup").style.display = "none";
			this.container.style.display = "block";

			this.postRender();
		});
	}

	postRender() {
		if (WebGL.isWebGLAvailable()) {
			this.createOverlay();
			const countdownStart = Date.now() / 1000 + 3;
			this.startCountdown(countdownStart);
		} else {
			console.error("WebGL not supported:", WebGL.getWebGLErrorMessage());
		}
	}

	startGame() {
		this.engine = new Engine(this, this.isAIEnabled, this.playerNames);
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

		const countDownInterval = setInterval(() => {
			secondsLeft -= 1;
			this.updateOverlayCountdown(secondsLeft);

			if (secondsLeft <= 0) {
				clearInterval(countDownInterval);
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
            <button class="btn btn-primary mt-3" onclick="window.location.href='/home'">Go Home</button>
          </div>
        </div>
      `;
	}
}

customElements.define("local-game-page", LocalGamePage);
