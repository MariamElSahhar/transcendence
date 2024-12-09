import { Component } from "../Component.js";
import { isAuth } from "../../../js/utils/session-manager.js";

export class HomePage extends Component {
	authenticated = false;
	constructor() {
		super();
	}

	async connectedCallback() {
		await import("./HomeContent.js");
		this.authenticated = await isAuth();
		super.connectedCallback();
	}

	render() {
		return `
				<home-content></home-content>
			`;
	}
}

customElements.define("home-page", HomePage);
