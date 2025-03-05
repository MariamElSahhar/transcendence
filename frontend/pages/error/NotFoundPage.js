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
			<h1>404</h1>
			<h1>Page Not Found :(</h1>
				<p>Double check the URL or go <a class="link-dark cursor-pointer" onclick="window.redirect('/')">back to ${
					self.auth ? "home" : "welcome page"
				}.</a></p>
			</div>
		`;
	}
}

customElements.define("not-found-page", NotFoundPage);
