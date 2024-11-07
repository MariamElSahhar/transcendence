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
		if (this.authenticated) {
			return `
				<navbar-component nav-active="home"></navbar-comfponent>
				<friends-sidebar-component main-component="home-content-component"></friends-sidebar-component>
			`;
		} else {
			return `
				<navbar-component nav-active="home"></navbar-component>
				<home-content></home-content>
			`;
		}
	}
}

customElements.define("home-page", HomePage);
