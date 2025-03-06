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
	}

	render() {
		return `
		<div id="slot-component">
				<div id="slot" slot="page-content" >${this.slot}</div>
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
		console.log("WHATTTT")
		this.slot = "";
		this.slot = content;
		if (super.isRendered()) this.attributeChangedCallback();
	}
}

customElements.define("slot-component", SlotComponent);