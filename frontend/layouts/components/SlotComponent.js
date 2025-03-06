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
			<div id="slot" class="w-100 h-100" slot="page-content" >${this.slot}</div>
        `;
	}

	style() {
		return `
		<style>
			#slot > * {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
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
