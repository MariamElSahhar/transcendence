import { Component } from "../../pages/Component.js";
import { getUserSessionData } from "../../scripts/utils/session-manager.js";

export class SlotComponent extends Component {
	constructor() {
		super();
		this.user = {};
		this.slot;
	}

	async connectedCallback() {
		await import("./navbar/Navbar.js");

		this.user = getUserSessionData();
		super.connectedCallback();
		this.slot = "";
		this.dispatchEvent(
			new CustomEvent("connected", { bubbles: true, composed: true })
		);
		// this.slot = content;
		// if (super.isRendered()) this.attributeChangedCallback();
	}

	render() {
		return `
		<div id="slot-component">
				<navbar-component></navbar-component>
				<div id="slot" slot="page-content" class="position-relative z-1 flex-grow-1 flex-1 d-flex w-100 h-100">${this.slot}</div>
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
		if (super.isRendered()) this.attributeChangedCallback();
	}
}

customElements.define("slot-component", SlotComponent);
