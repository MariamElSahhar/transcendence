class RegisterPage extends HTMLElement {
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
			<!-- Main content area for registration -->
			<main id="register-page">
				<h1 class="page-title text-center">Create Account</h1>

				<!-- Registration form inside a styled box -->
				<div class="registration-box mx-auto p-4">
					<form id="registerForm">
						<div class="row mb-3">
							<label for="registerFirstName" class="col-md-4 col-form-label"
								>First Name</label
							>
							<div class="col-md-8">
								<input
									type="text"
									class="form-control"
									id="registerFirstName"
									required
								/>
							</div>
						</div>

						<div class="row mb-3">
							<label for="registerLastName" class="col-md-4 col-form-label"
								>Last Name</label
							>
							<div class="col-md-8">
								<input
									type="text"
									class="form-control"
									id="registerLastName"
									required
								/>
							</div>
						</div>

						<div class="row mb-3">
							<label for="registerUsername" class="col-md-4 col-form-label"
								>Username</label
							>
							<div class="col-md-8">
								<input
									type="text"
									class="form-control"
									id="registerUsername"
									required
								/>
							</div>
						</div>
						<div class="row mb-3">
							<label for="registerEmail" class="col-md-4 col-form-label"
								>Email</label
							>
							<div class="col-md-8">
								<input
									type="email"
									class="form-control"
									id="registerEmail"
									required
								/>
							</div>
						</div>
						<div class="row mb-3">
							<label for="registerPassword" class="col-md-4 col-form-label"
								>Password</label
							>
							<div class="col-md-8">
								<input
									type="password"
									class="form-control"
									id="registerPassword"
									required
								/>
							</div>
						</div>
						<div class="row mb-3">
							<label
								for="registerConfirmPassword"
								class="col-md-4 col-form-label"
								>Confirm Password</label
							>
							<div class="col-md-8">
								<input
									type="password"
									class="form-control"
									id="registerConfirmPassword"
									required
								/>
							</div>
						</div>

						<!-- Error message container -->
						<div id="error-message" class="text-danger mb-3"></div>

						<div class="row">
							<div class="col-md-12 text-center">
								<button type="submit" class="btn btn-success w-50">
									Register
								</button>
							</div>
						</div>
					</form>
				</div>
			</main>
		`;
	}

	addEventListeners() {
		const form = this.querySelector("#registerForm");
		if (form) {
			form.addEventListener("submit", this.handleSubmit.bind());
		}
	}

	async handleSubmit(event) {
		event.preventDefault();
		console.log("handling submit");

		const firstName = document.getElementById("registerFirstName").value;
		const lastName = document.getElementById("registerLastName").value;
		const username = document.getElementById("registerUsername").value;
		const email = document.getElementById("registerEmail").value;
		const password = document.getElementById("registerPassword").value;
		const confirmPassword = document.getElementById(
			"registerConfirmPassword"
		).value;
		const errorMessage = document.getElementById("error-message");

		// Clear previous error message
		errorMessage.style.display = "none";
		errorMessage.textContent = "";

		// Debugging logs to check form values
		console.log("First Name:", firstName);
		console.log("Last Name:", lastName);
		console.log("Username:", username);
		console.log("Email:", email);
		console.log("Password:", password);
		console.log("Confirm Password:", confirmPassword);

		// Validate all fields are filled
		if (
			!firstName ||
			!lastName ||
			!username ||
			!email ||
			!password ||
			!confirmPassword
		) {
			errorMessage.textContent = "All fields are required!";
			errorMessage.style.display = "block"; // Ensure it's set to block
			return;
		}

		// Email validation
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailPattern.test(email)) {
			errorMessage.textContent = "Please enter a valid email address.";
			errorMessage.style.display = "block";
			return;
		}

		// Password validation
		const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
		if (!passwordPattern.test(password)) {
			errorMessage.textContent =
				"Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number.";
			errorMessage.style.display = "block";
			return;
		}

		// Check if passwords match
		if (password !== confirmPassword) {
			errorMessage.textContent = "Passwords do not match!";
			errorMessage.style.display = "block";
			return;
		}

		// Proceed with storing or handling the form submission
		console.log("Form is valid, storing data...");
		localStorage.setItem("playerUsername", Username);
		localStorage.setItem("playerEmail", email);

		if (typeof handleLocation === "function") {
			redirect("/users");
		} else {
			console.log("Routing to two_factor page...");
			window.location.href = "/two_factor.html";
		}
	}
}

customElements.define("register-page", RegisterPage);
