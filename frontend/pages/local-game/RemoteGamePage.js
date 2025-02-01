import { Component } from "../Component.js";
import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";
import { Engine } from "./Engine.js";
import { getUserSessionData } from "../../js/utils/session-manager.js";
import { addLocalGame } from "../../js/clients/gamelog-client.js";

export class RemoteGamePage extends Component {
	constructor() {
		super();
		this.container = null;
		this.engine = null;
		this.overlay = null;
		this.players = []; // Stores player names
		this.scores = [0, 0]; // Tracks scores for both players
		this.isAIEnabled = false;
	}

	connectedCallback() {
		const userData = getUserSessionData();
		const firstPlayerName = userData.username || "Player 1";
		this.players.push(firstPlayerName);

		this.innerHTML = `
		<style>

.circle-container {
    position: relative;
    width: 150px;
    height: 150px;
}

.circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 10px solid #e6e6e6; /* Background color of the bar */
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.circle::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 10px solid transparent;
    border-top: 10px solid #3498db; /* Active color of the bar */
    animation: spin 60s linear infinite;
}

.icon {
    font-size: 2rem;
    position: absolute;
    color: #555;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
		</style>
            <div class="p-3 border rounded bg-light">
              <h4 class="text-center">Searching for your opponent! </h4>
			  <div class="circle-container">
        <div class="circle">
            <h1><i class="bi bi-person"></i> </h1>
        </div>
    </div>
            </div>
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
			this.players = [this.players[0]];

			const player2Name = AICheckbox.checked
				? "Computer"
				: player2NameInput.value;
			this.players.push(player2Name || "Player 2");
			this.isAIEnabled = AICheckbox.checked;

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
		this.engine = new Engine(this, this.isAIEnabled);
		this.engine.startGame();
		this.removeOverlay();
	}

	updateScore(playerIndex) {
		if (playerIndex < this.scores.length) {
			this.scores[playerIndex] += 1;
			// console.log(
			// 	`Player ${playerIndex} scored! Current score: ${this.scores[playerIndex]}`
			// );
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
}

customElements.define("remote-game-page", RemoteGamePage);
