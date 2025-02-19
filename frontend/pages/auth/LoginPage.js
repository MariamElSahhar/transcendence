import { Component } from "../Component.js";
import { login } from "../../scripts/clients/token-client.js";
import { Footer } from "../../layouts/components/Footer.js";

export class LoginPage extends Component {
	constructor() {
		super();
		this.state = {
			usernameValid: false,
			passwordValid: false,
			showPassword: false,
			errorMessage: "",
		};
		this.displayError = this.displayError.bind(this);
		this.hideError = this.hideError.bind(this);
	}

	render() {
		return `
			<div
				id="container"
				class="d-flex flex-column w-100 vh-100 overflow-hidden position-relative">
				<div class="sky"></div>
				<h3 class="w-100 py-2">
					<i role="button" class="bi bi-arrow-left p-2 mx-2" onclick="window.redirect('/')"></i>
				</h3>
				<main class="d-flex justify-content-center align-items-center flex-grow-1">
					<div class="login-card card shadow p-5 mx-auto bg-light">
						<h2 class="m-0 w-100 text-center mb-3">Welcome Back</h2>

						<!-- Form -->
						<form id="login-form" class="needs-validation">

							<!-- Error -->
							<div id="error-alert" class="alert alert-danger d-none" role="alert">${this.state.errorMessage}</div>

							<!-- Username -->
							<div class="form-group mb-1">
								<div class="input-group">
									<input type="text" class="form-control" id="login" placeholder="Username">
									<div id="login-feedback" class="invalid-feedback">Please enter a valid username.</div>
								</div>
							</div>

							<!-- Password -->
							<div class="form-group mb-1">
								<div class="input-group">
									<input type="password" class="form-control" id="password" placeholder="Password">
									<span id="toggle-password" class="input-group-text">
										<i class="bi bi-eye"></i>
									</span>
								</div>
							</div>

							<!-- Submit -->
							<div>
								<button id="login-btn" class="btn w-100 mt-1" type="submit" disabled>Log In</button>
							</div>

							<!-- Sign Up -->
							<div class="text-center mt-2">
								<small role="button" id="register-link">Don't have an account? <span class="text-decoration-underline">Sign up</span></small>
							</div>
						</form>
					</div>
				</main>
				<footer-component class="mt-auto"></footer-component>
			</div>
		`;
	}

	style() {
		return `
		<style>
			/* Sky animation */
			.sky {
				display: flex;
				background: url(/assets/sky.png);
				background-size: contain;
				background-repeat: repeat-x;
				position: absolute;
				top: 0;
				left: -400%;
				width: 500%;
				height: 20em;
				animation: move-sky 500s linear infinite;
				opacity: 0.2;
				z-index: 0;
				pointer-events: none; /* Allow interactions with elements above */
			}

			@keyframes move-sky {
				from {
					transform: translateX(0%);
				}
				to {
					transform: translateX(60%);
				}
			}

		</style>`;
	}

	postRender() {
		const usernameInput = this.querySelector("#login");
		const passwordInput = this.querySelector("#password");
		const togglePasswordButton = this.querySelector("#toggle-password");
		const loginForm = this.querySelector("#login-form");
		const loginButton = this.querySelector("#login-btn");
		const errorAlert = this.querySelector("#error-alert");
		const registerLink = this.querySelector("#register-link");

		usernameInput.addEventListener("input", () => {
			this.handleUsernameInput(usernameInput, loginButton);
		});

		passwordInput.addEventListener("input", () => {
			this.handlePasswordInput(passwordInput, loginButton);
		});

		togglePasswordButton.addEventListener("click", () =>
			this.switchPasswordVisibility(passwordInput, togglePasswordButton)
		);

		loginForm.addEventListener("submit", (event) => {
			event.preventDefault();
			this.submitLogin(
				usernameInput.value,
				passwordInput.value,
				errorAlert,
				loginButton
			);
		});

		registerLink.addEventListener("click", () => {
			window.location.href = "/sign-up";
		});
	}

	handleUsernameInput(input, loginButton) {
		this.state.usernameValid = input.value.trim().length > 0;
		this.updateSubmitButtonState(loginButton);
	}

	handlePasswordInput(input, loginButton) {
		this.state.passwordValid = input.value.trim().length > 0;
		this.updateSubmitButtonState(loginButton);
	}

	switchPasswordVisibility(input, toggleButton) {
		this.state.showPassword = !this.state.showPassword;
		input.type = this.state.showPassword ? "text" : "password";

		const icon = toggleButton.querySelector("i");
		if (this.state.showPassword) {
			icon.classList.remove("bi-eye");
			icon.classList.add("bi-x");
		} else {
			icon.classList.remove("bi-x");
			icon.classList.add("bi-eye");
		}
	}

	updateSubmitButtonState(button) {
		button.disabled = !(
			this.state.usernameValid && this.state.passwordValid
		);
	}

	async submitLogin(username, password, errorAlert, loginButton) {
		loginButton.disabled = true;
		loginButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...`;

		const { success, error, otp } = await login({ username, password });
		if (success) {
			errorAlert.classList.add("d-none");
			if (otp) this.renderTwoFactorAuth(username);
			else window.redirect("/home");
		} else {
			errorAlert.classList.remove("d-none");
			errorAlert.textContent = error;
		}
		loginButton.innerHTML = "Log In";
		loginButton.disabled = false;
	}

	async renderTwoFactorAuth(username) {
		await import("./TwoFactorAuth.js");
		const container = this.querySelector("main");
		container.innerHTML = "";
		const twoFactorComponent = document.createElement("tfa-component");
		twoFactorComponent.login = username;
		container.appendChild(twoFactorComponent);
	}

	resetForm(usernameInput, passwordInput, errorAlert, loginButton) {
		usernameInput.value = "";
		passwordInput.value = "";
		this.state.usernameValid = false;
		this.state.passwordValid = false;
		loginButton.disabled = true;
		this.hideError(errorAlert);
	}

	displayError(message, errorAlert) {
		if (!errorAlert) {
			console.error("Error alert element not found.");
			return;
		}

		errorAlert.textContent = message || "An unknown error occurred.";
		errorAlert.classList.remove("d-none");
	}

	hideError(errorAlert) {
		if (!errorAlert) {
			console.error("Error alert element not found.");
			return;
		}

		errorAlert.classList.add("d-none");
		errorAlert.textContent = "";
	}
}

customElements.define("login-page", LoginPage);
