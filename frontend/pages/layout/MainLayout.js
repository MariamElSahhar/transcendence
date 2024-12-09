import { Component } from "../Component.js";
import { getUserSessionData } from "../../js/utils/session-manager.js";

export class MainLayout extends Component {
	constructor() {
		super();
		this.user = {};
		this.slot;
	}

	async connectedCallback() {
		await import("./components/navbar/Navbar.js");
		await import("./components/Footer.js");

		this.user = getUserSessionData();
		super.connectedCallback();
	}

	render() {
		return `
			<div id="main-layout" class="h-100vh d-flex flex-column">
				<layout-navbar-component></layout-navbar-component>
				<div id="slot" slot="page-content">${this.slot}</div>
				<footer-component class="mt-auto"></footer-component>
			</div>
        `;
	}

	renderSlot(content) {
		this.slot = "";
		this.slot = content;
	}
}

customElements.define("main-layout", MainLayout);
