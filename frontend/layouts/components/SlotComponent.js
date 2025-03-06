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
	}

	render() {
		return `
		<div id="slot-component" class="w-100">
				<div id="slot"  class="w-100" slot="page-content" >${this.slot}</div>
		</div>
        `;
	}

	style() {
		return `
		<style>

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