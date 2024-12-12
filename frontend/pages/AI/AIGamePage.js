import { Component } from "../Component.js";

export class AIGamePage extends Component {
	constructor() {
		super();
	}

	async connectedCallback() {
		console.log("GamePage connected to the DOM");
		await import("./AIGameContent.js");
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

customElements.define("ai-game-page", AIGamePage);
