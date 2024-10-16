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
			<main id="login-page" class="d-flex flex-column">
				<h1 class="text-white mb-3"> Welcome to Pong </h1>
				<div class="d-flex flex-column w-75 mw-500 p-3 bg-dark align-items-center rounded">
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
				</div>
			</main>
		`;
		/* this.innerHTML = `
		<navbar-component></navbar-component>
		<main id="login-page">
			<div class="container">
				<h1 class="text-center">Welcome to Pong!</h1>

				<!-- Login Form -->
				<form id="login" class="mt-4" autocomplete="off">
					<!-- Username Input -->
					<div class="mb-3">
						<label for="loginUser" class="form-label">Username</label>
						<input
							type="text"
							class="form-input"
							name="username"
							autocomplete="off"
							autocorrect="off"
							spellcheck="false"
						/>
					</div>

					<!-- Password Input -->
					<div class="mb-3">
						<label for="loginPass" class="form-label">Password</label>
						<input
							type="password"
							class="form-input"
							name="password"
							autocomplete="off"
						/>
					</div>

					<!-- Submit Button -->
					<div class="text-center">
						<button type="submit" class="btn btn-primary w-100">
							Login
						</button>
					</div>
				</form>

				<!-- Link to Registration Page -->
				<p class="mt-3 text-center">
					New user? <a href="/register" onclick="route(event)">Register here</a>
				</p>
			</div>
		</main>
	  `; */
	}

	addEventListeners() {
		const form = this.querySelector("#loginForm");
		if (form) {
			form.addEventListener("submit", this.handleSubmit.bind());
		}
	}

	async handleSubmit(event) {
		event.preventDefault();

		const username = document.getElementById("loginUser").value;
		const password = document.getElementById("loginPass").value;

		if (username && password) {
			redirect("/register");
		} else {
			alert("Please enter both username and password.");
		}
	}
}

customElements.define("login-page", LoginPage);
