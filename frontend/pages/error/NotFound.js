import { Component } from "../Component.js";

class NotFoundPage extends Component {
	render() {
		return `<h1>404 - Page Not Found</h1>`;
	}
}

customElements.define("not-found-page", NotFoundPage);
