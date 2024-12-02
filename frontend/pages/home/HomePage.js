import { Component } from "../Component.js";
import { isAuth } from "../../../js/utils/session-manager.js";

export class HomePage extends Component {
	authenticated = false;
	constructor() {
		super();
	}

	async connectedCallback() {
		await import("../navbar/Navbar.js");
		await import("./HomeContent.js");
		this.authenticated = await isAuth();
		super.connectedCallback();
	}

	render() {
		return `
				<navbar-component></navbar-component>
				<home-content></home-content>
			`;
	}
}

customElements.define("home-page", HomePage);
