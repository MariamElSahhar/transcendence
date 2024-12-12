import { Component } from "../Component.js";

export class HomePage extends Component {
	authenticated = false;
	constructor() {
		super();
	}

	async connectedCallback() {
		super.connectedCallback();
	}

	render() {
		return `
			<div class="w-100 h-100 d-flex flex-column align-items-center row-gap-3 p-2">
				<div class="w-100 h-100 bg-light d-flex">
					<div class="w-50 h-100 bg-secondary">
						<h2>Pong</h2>
					</div>
					<div class="w-50 h-100 bg-secondary d-flex flex-column justify-content-end">
						<button id="local-game">Play Local</button>
						<button id="remote-game">Play Remote</button>
						<button id="tournament">Start a Tournament</button>
					</div>
				</div>
				<div class="w-100 h-100 bg-light d-flex">
					<div class="w-50 h-100 bg-secondary d-flex flex-column justify-content-end">
						<button id="ttt">Play Remote</button>
					</div>
					<div class="w-50 h-100 bg-secondary">
						<h2>Tic Tac Toe</h2>
					</div>
				</div>
			</div>
			`;
	}

	postRender() {
		super.addComponentEventListener(
			this.querySelector("#local-game"),
			"click",
			() => {
				window.redirect("/play/local");
			}
		);
		super.addComponentEventListener(
			this.querySelector("#remote-game"),
			"click",
			() => {
				window.redirect("/play/remote");
			}
		);
		super.addComponentEventListener(
			this.querySelector("#tournament"),
			"click",
			() => {
				window.redirect("/play/tournament");
			}
		);
		super.addComponentEventListener(
			this.querySelector("#ttt"),
			"click",
			() => {
				window.redirect("/play/tictactoe");
			}
		);
	}
}

customElements.define("home-page", HomePage);
