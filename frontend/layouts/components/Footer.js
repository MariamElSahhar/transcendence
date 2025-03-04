import { Component } from "../../pages/Component.js";

export class Footer extends Component {
	constructor() {
		super();
	}

	render() {
		return `
			<footer class="footer bg-light text-center py-3 w-100 min-vw-100">
    			<small class="text-light">&copy; 2024 Transcendence</small>
        	</footer>
		`;
	}

}

customElements.define("footer-component", Footer);
