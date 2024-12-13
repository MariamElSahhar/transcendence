import { Component } from "../Component.js";
import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";
import { Engine } from "./Engine.js";
import { getUserSessionData } from "../../js/utils/session-manager.js";

export class GameContent extends Component {
	constructor() {
		super();
		this.container = null;
		this.engine = null;
		this.overlay = null;
		this.players = []; // Stores player names
		this.scores = [0, 0]; // Tracks scores for both players
	}

	connectedCallback() {
		const userData = getUserSessionData();
		const firstPlayerName = userData.username || "Player 1";
		this.players.push(firstPlayerName);

		this.innerHTML = `
            <div id="player-setup" class="p-3 border rounded bg-light" style="max-width: 400px; margin: 40px auto 0;">
              <h3 class="text-center">Setup Players</h3>
              <form id="player-form">
                <div id="player-names">
                  <div class="mb-3">
                    <label for="player2-name" class="form-label text-center d-block">PLEASE ENTER PLAYER'S NAME:</label>
                    <input type="text" id="player2-name" name="player2-name" class="form-control" required />
                  </div>
                </div>
                <button type="submit" class="btn btn-primary mt-3 w-100">Start Game</button>
              </form>
            </div>
            <div id="container" class="m-2 position-relative" style="display:none;"></div>
        `;

		this.container = this.querySelector("#container");
		this.setupPlayerForm();
	}

	setupPlayerForm() {
		const form = this.querySelector("#player-form");

		form.addEventListener("submit", (event) => {
			event.preventDefault();
			this.players = [this.players[0]];

			const player2Name = form.querySelector("#player2-name").value;
			this.players.push(player2Name || "Player 2");

			this.querySelector("#player-setup").style.display = "none";
			this.container.style.display = "block";

			this.postRender();
		});
	}

	postRender() {
		//this.addComponentEventListener(document, Theme.event, this.themeEvent.bind(this));

		if (WebGL.isWebGLAvailable()) {
			this.createOverlay();
			const countdownStart = Date.now() / 1000 + 3;
			this.startCountdown(countdownStart);
		} else {
			console.error("WebGL not supported:", WebGL.getWebGLErrorMessage());
		}
	}

	startGame() {
		this.engine = new Engine(this);
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
		const playerName = this.players[0];
		const opponentName = this.players[1];

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

	// themeEvent() {
	//     if (Theme.get() === "light") {
	//         this.engine?.scene?.setLightTheme();
	//     }
	// }

	endGame() {
		this.addEndGameCard(); // Display the final score when the game ends
	}
}

customElements.define("game-content-component", GameContent);
