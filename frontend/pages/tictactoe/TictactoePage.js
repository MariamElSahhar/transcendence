import { Component } from "../Component.js";
import { isAuth } from "../../../js/utils/session-manager.js";

export class TicTacToePage extends Component {
	authenticated = false;
	constructor() {
		super();
	}

	async connectedCallback() {
		await import("../navbar/Navbar.js");
		await import("./TictactoeContent.js");
		this.authenticated = await isAuth();
		super.connectedCallback();
	}

	render() {
		if (this.authenticated) {
			return `
				<navbar-component nav-active="home"></navbar-component>
				<friends-sidebar-component main-component="tic-tac-toe-content-component"></friends-sidebar-component>
			`;
		} else {
			return `
				<navbar-component nav-active="home"></navbar-component>
				<tic-tac-toe-content></tic-tac-toe-content>
			`;
		}
	}
}

customElements.define("tic-tac-toe-page", TicTacToePage);