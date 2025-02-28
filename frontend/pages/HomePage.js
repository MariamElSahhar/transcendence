import { Component } from "./Component.js";

export class HomePage extends Component {
	render() {
		const buttonClasses =
			"btn btn-primary brick-border d-flex align-items-center justify-content-between w-100 p-3 fw-bold";

		return `
            <div class="d-flex w-100 h-100 justify-content-between align-items-center">
				<div class="container w-100">
					<button id="play-single-player-game" class="${buttonClasses}">
						${window.icons.mario()}
						Single Player
						${window.icons.robot(true)}
					</button>
					<button id="play-two-player-game" class="${buttonClasses}">
						${window.icons.mario()}
						Two Player
						${window.icons.luigi(true)}
					</button>
					<button id="play-remote-game" class="${buttonClasses}">
						${window.icons.mario()}
						Online Two Player
						${window.icons.mario(true)}
					</button>
					<button id="play-tournament" class="${buttonClasses}">
						${window.icons.mario()}
						${window.icons.mario()}
						Tournament
						${window.icons.luigi(true)}
						${window.icons.luigi(true)}
					</button>
					<button id="play-ttt" class="${buttonClasses}">
						${window.icons.shroom()}
						Tic Tac Toe
						${window.icons.plant(true)}
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

			.icon {
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
