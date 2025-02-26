import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { Component } from "./Component.js";

export class HomePage extends Component {
	topScene = null;
	topRenderer = null;
	topCamera = null;
	topSphere = null;
	topAnimationId = null;

	bottomScene = null;
	bottomRenderer = null;
	bottomCamera = null;
	bottomX = null;
	bottomO = null;
	bottomAnimationId = null;
	directionX = 0.02;
	directionY = 0.02;

	constructor() {
		super();
	}

	async connectedCallback() {
		super.connectedCallback();
	}

	render() {
		const buttonClasses =
			"btn btn-primary brick-border d-flex align-items-center justify-content-between w-100 p-3 fw-bold";
		return `
            <div class="d-flex w-100 h-100 justify-content-between align-items-center">
				<div class="container w-100">
					<button id="play-single-player-game" class="${buttonClasses}">
						<img src="/assets/sprites/mario.png" class="btn-icon" alt="Left Icon">
						Single Player
						<img src="/assets/sprites/robot.png" class="btn-icon" alt="Right Icon">
					</button>
					<button id="play-two-player-game" class="${buttonClasses}">
						<img src="/assets/sprites/mario.png" class="btn-icon" alt="Left Icon">
						Two Player
						<img src="/assets/sprites/luigi.png" class="btn-icon" alt="Right Icon">
					</button>
					<button id="play-remote-game" class="${buttonClasses}">
						<img src="/assets/sprites/mario.png" class="btn-icon" alt="Left Icon">
						Online Two Player
						<img src="/assets/sprites/mario.png" class="btn-icon" alt="Right Icon">
					</button>
					<button id="play-tournament" class="${buttonClasses}">
						<img src="/assets/sprites/mario.png" class="btn-icon" alt="Left Icon">
						Tournament
						<img src="/assets/sprites/mario.png" class="btn-icon" alt="Right Icon">
					</button>
					<button id="play-ttt" class="${buttonClasses}">
						<img src="/assets/sprites/mario.png" class="btn-icon" alt="Left Icon">
						Tic Tac Toe
						<img src="/assets/sprites/mario.png" class="btn-icon" alt="Right Icon">
					</button>
				</div>
			</div>
    `;
	}

	style() {
		return `
		<style>
			button {
				max-width: 300px;
				max-height: 60px;
			}

			.container {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				grid-template-rows: auto auto auto;
				gap: 10px;
				max-width: 700px;
			}

			.container button:nth-child(5) {
				grid-column: span 2;
				justify-self: center;
			}

			@media (max-width: 500px) {
				.container {
					grid-template-columns: 1fr;
				}

				.button:nth-child(5) {
					grid-column: auto;
				}
			}

			.brick-border {
				border: none !important;
				border-radius: 0 !important;
				border-bottom: 1px solid #513604 !important;
				border-right: 1px solid #513604 !important;
			}

			.btn-icon {
				width: auto;
				height: 30px;
			}
		</style>
		`;
	}

	postRender() {
		// Play Local Game Button
		super.addComponentEventListener(
			this.querySelector("#play-single-player-game"),
			"click",
			() => {
				window.redirect("/play/single-player");
			}
		);
		super.addComponentEventListener(
			this.querySelector("#play-two-player-game"),
			"click",
			() => {
				window.redirect("/play/two-player");
			}
		);

		// Play Remote Game Button
		super.addComponentEventListener(
			this.querySelector("#play-remote-game"),
			"click",
			() => {
				window.redirect("/play/remote");
			}
		);

		// Join Tournament Button
		super.addComponentEventListener(
			this.querySelector("#play-tournament"),
			"click",
			() => {
				window.redirect("/play/tournament");
			}
		);

		// Play Tic Tac Toe Remotely Button
		super.addComponentEventListener(
			this.querySelector("#play-ttt"),
			"click",
			() => {
				window.redirect("/play/tictactoe");
			}
		);
	}
}

customElements.define("home-page", HomePage);
