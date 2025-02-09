import { Component } from "../../pages/Component.js";

export class Footer extends Component {
	constructor() {
		super();
	}

	render() {
		return `
			<footer class="footer bg-light text-light text-center py-3">
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
					background-size: 70px 70px;
				}
			</style>
		`;
	}
}

customElements.define("footer-component", Footer);
