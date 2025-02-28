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
			<div id="main-layout" class="min-vh-100 d-flex flex-column position-relative overflow-hidden">
				<div class="sky"></div>
				<navbar-component></navbar-component>
				<div id="slot" slot="page-content" class="position-relative z-1 flex-grow-1 flex-1 d-flex w-100 h-100">${this.slot}</div>
				<div class="pipes-container d-flex w-100 justify-content-center position-absolute z-0">
					<div class="left-pipe-container d-flex flex-column position-relative align-items-center">
						<img class="pipe left-pipe" src="/assets/pipe.png" alt="X"/>
					</div>
					<div class="right-pipe-container d-flex flex-column position-relative align-items-center">
						<img class="pipe right-pipe" src="/assets/pipe.png" alt="X"/>
					</div>
				</div>
				<footer-component class="position-relative mt-auto"></footer-component>
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
