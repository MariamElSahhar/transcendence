import { Component } from "../Component.js";
import { isAuth } from "../../scripts/utils/session-manager.js";

class NotFoundPage extends Component {
	async connectedCallback() {
		self.auth = await isAuth();
		super.connectedCallback();
	}

	render() {
		return `
			<div class="vh-100 w-100 d-flex flex-column align-items-center pt-5">
				<h1 class="">Page Not Found :(</h1>
				<p>Double check the URL or go <a href=${
					self.auth ? "/home" : "/"
				}>back to home</a></p>
			</div>
		`;
	}
}

customElements.define("not-found-page", NotFoundPage);
