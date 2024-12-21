import { Component } from "./Component.js";

export class LandingPage extends Component {
	constructor() {
		super();
	}

	render() {
		return `
				<div class="d-flex flex-column justify-content-center align-items-center h-100vh w-100 gap-2">
					<h1>Welcome to Pong</h1>
					<button class="btn btn-primary w-25" onclick="window.redirect('/sign-in')">Sign In</button>
					<button class="btn btn-primary w-25" onclick="window.redirect('/sign-up')">Create New Account</button>
				</div>
		`;
	}
}

customElements.define("landing-page", LandingPage);
