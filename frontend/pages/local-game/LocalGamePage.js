import { Component } from "../Component.js";
import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";
import { Engine } from "./Engine.js";
import { getUserSessionData } from "../../scripts/utils/session-manager.js";
import { renderEndGameCard, renderGameInfoCard } from "./Overlays.js";

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
		console.log("here")
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
		super.disconnectedCallback();
	}

	render() {
		return `
			<div id="container" class="d-flex justify-content-center align-items-center w-100 h-100">
				${
					this.isAIEnabled
						? ""
						: `<div id="player-setup" class="p-3 card shadow p-5 mx-auto rounded bg-light">
							<h2 class="w-100 text-center">Setup Players</h2>
							<form id="player-form" class="d-flex flex-column gap-2">
								<input type="text" class="form-control w-100 text-dark" placeholder="${
									getUserSessionData().username
								}" disabled/>
								<input type="text" id="player2-name" name="player2-name" class="form-control w-100 text-dark" placeholder="Player 2 display name"/>
								<button id="submit-players" type="submit" class="btn w-100" disabled>Start Game</button>
							</form>
						</div>`
				}
			</div>
        `;
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

	postRender() {
		this.container = this.querySelector("#container");
		let overlay, countDownIntervalId;
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

			startGameButton.addEventListener("click", async (event) => {
				event.preventDefault();
				const player2Name = player2NameInput.value;
				this.playerNames.push(player2Name || "Player 2");

				// TODO put in start game function
				this.startGame();
			});
		} else {
			this.playerNames.push("Computer");
			setTimeout(async () => {
				this.startGame();
			}, 5);
		}
	}

	async startGame() {
		this.container.innerHTML = "";

		if (WebGL.isWebGLAvailable()) {
			this.engine = new Engine(this, this.isAIEnabled, this.playerNames);
			await this.engine.createScene();
			const { overlay, countDownIntervalId } = renderGameInfoCard(
				this,
				this.container,
				this.playerNames[0],
				this.playerNames[1],
				this.engine
			);
			this.overlay = overlay;
			this.countDownIntervalId = countDownIntervalId;
		} else {
			console.error("WebGL not supported:", WebGL.getWebGLErrorMessage());
		}
	}

	updateScore(playerIndex) {
		if (playerIndex < this.scores.length) this.scores[playerIndex] += 1;
	}

	renderEndGameCard(playerScore, opponentScore) {
		this.overlay = renderEndGameCard(
			this.container,
			this.playerNames,
			playerScore,
			opponentScore
		);
	}
}

customElements.define("local-game-page", LocalGamePage);
