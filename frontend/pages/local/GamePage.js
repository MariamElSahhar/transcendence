import { Component } from "../Component.js";
export class GamePage extends Component {
	constructor() {
		super();
	}

	async connectedCallback() {
		console.log("GamePage connected to the DOM");
		await import("./GameContent.js");
		super.connectedCallback();
	}

	render() {
		return `
        <div class="game-container">
          <game-content-component></game-content-component>
        </div>
		`;
	}
}

customElements.define("game-page", GamePage);
