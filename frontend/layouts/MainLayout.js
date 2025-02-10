import { Component } from "../pages/Component.js";
import { getUserSessionData } from "../scripts/utils/session-manager.js";

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
			<div id="main-layout" class="min-vh-100 d-flex flex-column">
				<navbar-component></navbar-component>
				<div id="slot" slot="page-content" class="flex-grow-1 d-flex w-100 h-100">${this.slot}</div>
				<footer-component class="mt-auto"></footer-component>
			</div>
        `;
	}

	style() {
		return `
		<style>
			#slot > * {
				width: 100%;
			}
		</style>
		`;
	}

	renderSlot(content) {
		this.slot = "";
		this.slot = content;
		if (super.isRendered()) this.update();
	}
}

customElements.define("main-layout", MainLayout);
