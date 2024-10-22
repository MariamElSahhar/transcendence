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
		 	<navbar-component></navbar-component>
			<main id="login-page" class="d-flex flex-column vh-100 vw-100 align-items-center justify-content-center text-align-center">
				<h2>Sign In</h2>
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
					<div id="error-message"></div>
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

		if (!username || !password) {
			document.getElementById("#error-message").textContent =
				"Please fill out all fields.";
			return;
		}

		const { success, error } = login({ username, password });
		if (success) {
			alert(`Login success`);
		} else {
			alert(error);
		}
	}

	isUserAuthenticated() {
		// Placeholder for actual authentication logic
		return (
			window.userManagementClient && window.userManagementClient.isAuth()
		);
	}

	redirectToHome() {
		window.getRouter().redirect("/");
	}
}

customElements.define("login-page", LoginPage);
