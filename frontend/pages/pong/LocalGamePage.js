import { Component } from "../Component.js";
import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";
import { Engine } from "./Engine.js";
import { getUserSessionData } from "../../scripts/utils/session-manager.js";
import { renderEndGameCard, renderPreGameCard } from "./Overlays.js";
import { showError } from "../error/ErrorPage.js";

export class LocalGamePage extends Component {
	constructor() {
		super();
		this.container = null;
		this.engine = null;
		this.overlay = null;
		this.playerNames = [];
		this.scores = [0, 0]; 
		this.isAIEnabled = window.location.pathname.endsWith("/single-player");
	}

	connectedCallback() {
		this.playerNames.push(getUserSessionData().username || "player 1");
		super.connectedCallback();
	}

	disconnectedCallback() {
		if (this.engine) {
			this.engine.threeJS.stopAnimationLoop();
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
						: `<div id="player-setup" class="p-3 card shadow p-5 bg-brick-100">
							<h2 class="w-100 text-center">Setup Players</h2>
							<form id="player-form" class="d-flex flex-column gap-2">
								<input type="text" class="form-control w-100 text-dark bg-brick-100" placeholder="${
									getUserSessionData().username
								}" disabled/>
								<input type="text" id="player2-name" name="player2-name" class="form-control w-100 text-dark bg-brick-200" placeholder="Player 2 display name"/>
								<button id="submit-players" type="submit" class="btn w-100" disabled>Continue</button>
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
			.icon {
				width: auto;
				height: 30px;
			}
		</style>
		`;
	}

	postRender() {
		this.container = this.querySelector("#container");
		if (!this.isAIEnabled) {
			const startGameButton = this.querySelector("#submit-players");
			const player2NameInput = this.querySelector("#player2-name");

			super.addComponentEventListener(player2NameInput, "input", () => {
				if (player2NameInput.value) {
					startGameButton.removeAttribute("disabled");
				} else {
					startGameButton.setAttribute("disabled", "");
				}
			});

			super.addComponentEventListener(
				startGameButton,
				"click",
				async (event) => {
					event.preventDefault();
					const player2Name = player2NameInput.value;
					this.playerNames.push(player2Name || "Player 2");
					this.startGame();
				}
			);
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
			this.querySelector("canvas")?.classList.add("d-none");
			setTimeout(() => {
				this.querySelector("canvas")?.classList.remove("d-none");
			}, 300);
			const { overlay, countDownIntervalId } = renderPreGameCard(
				this,
				this.container,
				this.playerNames[0],
				this.playerNames[1],
				this.engine
			);
			this.overlay = overlay;
			this.countDownIntervalId = countDownIntervalId;
		} else {
			showError();
			console.error("WebGL not supported:", WebGL.getWebGLErrorMessage());
		}
	}

	updateScore(playerIndex) {
		if (playerIndex < this.scores.length) this.scores[playerIndex] += 1;
	}

	renderEndGameCard(playerScore, opponentScore) {
		this.overlay = renderEndGameCard(this, this.playerNames, [
			playerScore,
			opponentScore,
		]);
	}
}

customElements.define("local-game-page", LocalGamePage);
