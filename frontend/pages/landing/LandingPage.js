import { Component } from "../Component.js";

export class LandingPage extends Component {
	constructor() {
		super();
	}

	render() {
		return `
				<h1>Landing Page</h1>
		`;
	}
}

customElements.define("landing-page", LandingPage);
