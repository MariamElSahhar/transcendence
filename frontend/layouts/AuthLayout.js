import { Component } from "../pages/Component.js";
import { getUserSessionData } from "../scripts/utils/session-manager.js";

export class AuthLayout extends Component {
	constructor() {
		super();
		this.landing;
		this.slot;
	}

	async connectedCallback() {
		await import("./components/Footer.js");
		await import("./components/SlotComponent.js");
		super.connectedCallback();
	}

	render() {
		return `
			<div
				id="container"
				class="d-flex flex-column align-items-center justify-content-center w-100 vh-100 overflow-hidden position-relative">

				<div class="sky"></div>

				<slot-component class="position-relative z-1 d-flex flex-column align-items-center justify-content-center flex-grow-1 flex-1 d-flex w-100 h-100"></slot-component>

				<div class="pipes-container d-flex w-100 justify-content-center position-absolute z-0">
					<div class="left-pipe-container d-flex flex-column position-relative align-items-center">
						<img class="pipe left-pipe z-3" src="/assets/pipe.webp" alt="X"/>
						<img  id="plant" class="pipe-content z-2" src="/assets/sprites/plant.webp" alt="X"/>
					</div>
					<div class="right-pipe-container d-flex flex-column position-relative align-items-center">
						<img class="pipe right-pipe z-3" src="/assets/pipe.webp" alt="X"/>
						<img id="shroom" class="pipe-content z-2" src="/assets/sprites/shroom.webp" alt="X"/>
					</div>
				</div>
				<footer-component class="position-relative mt-auto"></footer-component>
			</div>
        `;
	}

	style() {
		return `
		<style>
			#slot {
				height: 100%;
			}
			.sky {
				display: flex;
				background: url(/assets/sky.webp);
				background-size: contain;
				background-repeat: repeat-x;
				position: absolute;
				top: 0;
				left: -400%;
				width: 500%;
				opacity:0.8;
				height: 10em;
				animation: move-sky 500s linear infinite;
				z-index: 0 !important;
				pointer-events: none;
			}
		</style>
		`;
	}

	postRender() {
		document.querySelector("slot-component").renderSlot(this.slot);
	}

	renderSlot(content) {
		this.slot = content;
		this.landing = window.location.pathname == "/";
		if (super.isRendered()) {
			document.querySelector("slot-component").renderSlot(this.slot);
		}
	}
}

customElements.define("auth-layout", AuthLayout);
