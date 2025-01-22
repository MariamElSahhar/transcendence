import { Component } from "../Component.js";
import { isAuth } from "../../scripts/utils/session-manager.js";
import { login } from "../../scripts/clients/token-client.js";

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
		<style>
			/* Mario font */
			body, h1, h2, h3, .form-label, .btn, .input-group-text {
				font-family: 'New Super Mario Font U', sans-serif !important;
			}

			/* Sky animation */
			.sky {
				display: flex;
				background: url("http://127.0.0.1:8000/media/images/sky.png");
				background-size: contain;
				background-repeat: repeat-x;
				position: absolute;
				top: 0;
				left: -400%;
				width: 500%;
				height: 20em;
				animation: move-sky 500s linear infinite;
				opacity: 0.2;
			}

			@keyframes move-sky {
				from {
					left: -400%;
				}
				to {
					left: 100%;
				}
			}
		</style>
			<div
				id="container"
				class="d-flex flex-column w-100 vh-100"
				style="background-color: rgb(135, 206, 235); position: relative; overflow: hidden;">
				<div class="sky" style="z-index:-1"></div>
				<h3 class="w-100 py-2">
					<i role="button" class="bi bi-arrow-left p-2 mx-2" onclick="window.redirect('/')"></i>
				</h3>
				<main class="d-flex justify-content-center align-items-center flex-grow-1">
					<div class="login-card card shadow p-5 mx-auto border-warning" style="max-width: 400px;">
						<div class="text-center p-3 rounded mb-4 bg-danger text-warning  border-white">
							<h2 class="fw-bold  m-0">Log In</h2>
						</div>
						<form id="login-form" class="needs-validation bg-light p-4 rounded">
							<div class="form-group mb-4">
								<div class="input-group">
									<span class="input-group-text bg-light border-secondary">
										<i class="bi bi-person-fill"></i>
									</span>
									<input type="text" class="form-control border-secondary" id="login" placeholder="Enter your username">
									<div id="login-feedback" class="invalid-feedback">Please enter a valid username.</div>
								</div>
							</div>
							<div class="form-group mb-4">
								<div class="input-group">
									<span class="input-group-text bg-light border-secondary">
										<i class="bi bi-lock-fill"></i>
									</span>
									<input type="password" class="form-control border-secondary" id="password" placeholder="Enter your password">
									<span id="toggle-password" class="input-group-text bg-light border-secondary">
										<i class="bi bi-eye"></i>
									</span>
								</div>
							</div>
							<div id="error-alert" class="alert alert-danger d-none" role="alert">${this.state.errorMessage}</div>
							<div class="text-center mb-4">
								<small role="button" id="register-link" class="text-warning fw-bold" style="cursor: pointer;">Don't have an account? Sign up</small>
							</div>
							<div>
								<button id="login-btn" class="btn btn-warning w-100 fw-bold border border-primary text-dark" type="submit" disabled>Log In</button>
							</div>
						</form>
					</div>
				</main>
			</div>
		`;
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

		const { success, error } = await login({ username, password });
		if (success) {
			errorAlert.classList.add("d-none");
			const authenticated = await isAuth();
			if (authenticated) {
				window.redirect("/home");
			} else {
				this.initializeTwoFactorAuth(username);
			}
		} else {
			errorAlert.classList.remove("d-none");
			errorAlert.textContent = error;
		}
		loginButton.innerHTML = "Log In";
		loginButton.disabled = false;
	}

	async initializeTwoFactorAuth(username) {
		await import("./TwoFactorAuth.js");
		const container = this.querySelector("#container");
		container.innerHTML = '<div class="sky" style="z-index:0"></div>';
		container.style.justifyContent = "center";
		container.style.alignItems = "center";
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
