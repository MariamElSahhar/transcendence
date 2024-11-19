import { Component } from "../Component.js";

export class ErrorPage extends Component {
	static errorComponentName = "error-component";
	static networkErrorMessage =
		"Network error, " + "please check your network connection.";
	static notFoundMessage = "Page not found";

	static load(message, refresh = false) {
		window.app.innerHTML = `
        <navbar-component></navbar-component>
        <${ErrorPage.errorComponentName}
            message="${message}"
            refresh="${refresh}">
        </${ErrorPage.errorComponentName}>`;
	}

	static loadNetworkError() {
		this.load(this.networkErrorMessage, true);
	}

	static loadNotFound() {
		this.load(this.notFoundMessage, false);
	}
}

customElements.define("error-page", ErrorPage);
