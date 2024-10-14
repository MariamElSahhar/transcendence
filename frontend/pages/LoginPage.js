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
		<main id="login-page">
			<div class="container">
				<h1 class="text-center">Welcome to Pong!</h1>

				<!-- Login Form -->
				<form id="loginForm" class="mt-4" autocomplete="off">
					<!-- Username Input -->
					<div class="mb-3">
						<label for="loginUser" class="form-label">Username</label>
						<input
							type="text"
							class="form-control"
							id="loginUser"
							name="user1"
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
							class="form-control"
							id="loginPass"
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
	  `;
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
