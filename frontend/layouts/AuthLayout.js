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
		super.connectedCallback();
	}

	render() {
		return `
			<div
				id="container"
				class="d-flex flex-column align-items-center justify-content-center w-100 vh-100 overflow-hidden position-relative">
				<!-- Sky -->
				<div class="sky"></div>

				<!-- Arrow Back -->
				${
					this.landing
						? ``
						: `<h3 class="w-100 py-2">
						<i
							role="button"
							class="bi bi-arrow-left p-2 mx-2"
							onclick="window.redirect('/')"
						></i>
					</h3>`
				}

				<!-- Slot -->
				<div id="slot" slot="page-content" class="position-relative z-1 d-flex flex-column align-items-center justify-content-center flex-grow-1 flex-1 d-flex w-100 h-100">${
					this.slot
				}</div>

				<!-- Pipes -->
				<div class="pipes-container d-flex w-100 justify-content-center position-absolute z-0">
					<div class="left-pipe-container d-flex flex-column position-relative align-items-center">
						<img class="pipe left-pipe z-3" src="/assets/pipe.png" alt="X"/>
						<img  id="plant" class="pipe-content z-2" src="/pages/tictactoe/plant.png" alt="X"/>
					</div>
					<div class="right-pipe-container d-flex flex-column position-relative align-items-center">
						<img class="pipe right-pipe z-3" src="/assets/pipe.png" alt="X"/>
						<img id="shroom" class="pipe-content z-2" src="/pages/tictactoe/shroom.png" alt="X"/>
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
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.sky {
				display: flex;
				background: url(/assets/sky.png);
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
		this.slot = "";
		this.slot = content;
		this.landing = window.location.pathname == "/";
		if (super.isRendered()) this.attributeChangedCallback();
	}
}

customElements.define("auth-layout", AuthLayout);
