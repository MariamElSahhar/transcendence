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
		await import("./components/SlotComponent.js");
		// await import("./components/Footer.js");

		this.user = getUserSessionData();
		super.connectedCallback();
	}
	// <slot-component>
	// </slot-component>
	// <navbar-component></navbar-component>
	// <div id="slot" slot="page-content" class="position-relative z-1 flex-grow-1 flex-1 d-flex w-100 h-100">${this.slot}</div>
	render() {
		return `
		<div id="main-layout" class="min-vh-100 d-flex flex-column position-relative overflow-hidden">
		<div class="sky"></div>
		<slot-component> </slot-component>
		<div class="pipes-container d-flex w-100 justify-content-center position-absolute z-0">
					<div class="left-pipe-container d-flex flex-column position-relative align-items-center">
						<img class="pipe left-pipe" src="/assets/pipe.webp" alt="X"/>
					</div>
					<div class="right-pipe-container d-flex flex-column position-relative align-items-center">
						<img class="pipe right-pipe" src="/assets/pipe.webp" alt="X"/>
					</div>
				</div>
				<footer-component class="position-relative mt-auto"></footer-component>
			</div>
        `;
	}

	// render() {
	// 	return `
	// 	<div id="main-layout" class="min-vh-100 d-flex flex-column position-relative overflow-hidden">
	// 	<div class="sky"></div>
	// 	<navbar-component></navbar-component>
	// 	<div id="slot" slot="page-content" class="position-relative z-1 flex-grow-1 flex-1 d-flex w-100 h-100">${this.slot}</div>
	// 	<div class="pipes-container d-flex w-100 justify-content-center position-absolute z-0">
	// 				<div class="left-pipe-container d-flex flex-column position-relative align-items-center">
	// 					<img class="pipe left-pipe" src="/assets/pipe.webp" alt="X"/>
	// 				</div>
	// 				<div class="right-pipe-container d-flex flex-column position-relative align-items-center">
	// 					<img class="pipe right-pipe" src="/assets/pipe.webp" alt="X"/>
	// 				</div>
	// 			</div>
	// 			<footer-component class="position-relative mt-auto"></footer-component>
	// 		</div>
    //     `;
	// }

	style() {
		return `
		<style>
		#slot > * {
			width: 100%;
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

	renderSlot(content) {
		// this.slot = "";
		// this.slot = content;
		// if (super.isRendered())
		// {
			this.attributeChangedCallback();
			document.querySelector("slot-component").renderSlot(content)
		// }
	}
}

customElements.define("main-layout", MainLayout);
