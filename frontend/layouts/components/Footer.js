import { Component } from "../../pages/Component.js";

export class Footer extends Component {
	constructor() {
		super();
	}

	render() {
		return `
			<footer class="footer bg-light text-light text-center py-3 w-100 min-vw-100">
    			<small>&copy; 2024 Transcendence</small>
        	</footer>
		`;
	}

	style() {
		return `
			<style>
				footer {
					height: 50px;
					background-image: url(/assets/textures/floor.png);
					background-repeat: repeat;
					background-size: 80px 80px;
				}
			</style>
		`;
	}
}

customElements.define("footer-component", Footer);
