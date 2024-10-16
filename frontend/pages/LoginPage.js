import { login } from "../js/clients/token-client.js";

class LoginPage extends HTMLElement {
	constructor() {
		super();
	}

	async connectedCallback() {
		await import("./components/Navbar.js");
		this.render();
		this.addEventListeners();
	}

	render() {
		this.innerHTML = `
			<main id="login-page" class="d-flex flex-column vh-100 vw-100 align-items-center justify-content-center text-align-center">
				<h1 class="text-white mb-3"> Welcome to Pong </h1>
				<div class="d-flex flex-column w-75 mw-500 p-3 bg-dark bg-opacity-75 align-items-center rounded">
					<form id="login-form" class="w-100 d-flex flex-column align-items-center">
						<div class="mb-3 w-75">
							<label
								for="login-username-input"
								class="text-white w-100"
							>
								Username
							</label>
							<input
								id="login-username-input"
								class="w-100"
							/>
						</div>

						<div class="mb-3 w-75">
							<label
								for="login-password-input"
								class="text-white w-100"
							>
								Password
							</label>
							<input
								id="login-password-input"
								class="w-100"
							/>
						</div>

						<button
							type="submit"
							class="btn btn-primary w-75 mt-3"
						>
							Submit
						</button>
					</form>

					<p class="text-white">
						New user? <a href="/register" onclick="route(event)">Register here </a>
					</p>
				</div>
			</main>
		`;
	}

	addEventListeners() {
		const form = this.querySelector("#login-form");
		if (form) {
			form.addEventListener("submit", this.handleSubmit.bind(this));
		}
	}

	async handleSubmit(event) {
		event.preventDefault();

		const username = document.getElementById("login-username-input").value;
		const password = document.getElementById("login-password-input").value;

		if (username && password) {
			redirect("/register");
		} else {
			alert("Please enter both username and password.");
		}

		// login({ username, password });
	}
}

customElements.define("login-page", LoginPage);
