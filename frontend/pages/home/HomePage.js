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
						<button>Play Local</button>
						<button>Play Remote</button>
						<button>Start a Tournament</button>
					</div>
				</div>
				<div class="w-100 h-100 bg-light d-flex">
					<div class="w-50 h-100 bg-secondary d-flex flex-column justify-content-end">
						<button>Play Remote</button>
					</div>
					<div class="w-50 h-100 bg-secondary">
						<h2>Tic Tac Toe</h2>
					</div>
				</div>
			</div>
			`;
	}
}

customElements.define("home-page", HomePage);
