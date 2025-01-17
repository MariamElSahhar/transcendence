import { Component } from "../Component.js";
import { register } from "../../scripts/clients/token-client.js";
import {
	isValidSecurePassword,
	isValidUsername,
	isValidEmail,
} from "../../scripts/utils/input-validator.js";

export class SignUpPage extends Component {
	constructor() {
		super();
		this.isPasswordVisible = false;
		this.isConfirmPasswordVisible = false;

		this.validations = {
			username: false,
			email: false,
			password: false,
			confirmPassword: false,
		};

		this.errorState = {
			active: false,
			message: "",
		};
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
                    <div class="register-card card shadow p-5 mx-auto border-info border-warning" style="max-width: 400px;">
                        <div class="text-center p-3 rounded mb-4 bg-danger text-warning border border-white">
                            <h2 class="fw-bold m-0">Sign Up</h2>
                        </div>
                        <form id="registration-form" class="needs-validation bg-light p-4 rounded" novalidate>
                            <div class="form-group mb-4">
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-secondary">
                                        <i class="bi bi-person-fill"></i>
                                    </span>
                                    <input type="text" class="form-control border-secondary" id="username" placeholder="Enter your username" required>
                                    <div id="username-error" class="invalid-feedback">Invalid username.</div>
                                </div>
                            </div>
                            <div class="form-group mb-4">
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-secondary">
                                        <i class="bi bi-envelope-fill"></i>
                                    </span>
                                    <input type="email" class="form-control border-secondary" id="email" placeholder="Enter your email" required>
                                    <div id="email-error" class="invalid-feedback">Invalid email address.</div>
                                </div>
                            </div>
                            <div class="form-group mb-4">
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-secondary">
                                        <i class="bi bi-lock-fill"></i>
                                    </span>
                                    <input type="password" class="form-control border-secondary" id="password" placeholder="Enter your password" required>
                                    <span id="toggle-password-visibility" class="input-group-text bg-light border-secondary">
                                        <i class="bi bi-eye"></i>
                                    </span>
                                    <div id="password-error" class="invalid-feedback">Invalid password.</div>
                                </div>
                            </div>
                            <div class="form-group mb-4">
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-secondary">
                                        <i class="bi bi-lock-fill"></i>
                                    </span>
                                    <input type="password" class="form-control border-secondary" id="confirm-password" placeholder="Confirm your password" required>
                                    <span id="toggle-confirm-password-visibility" class="input-group-text bg-light border-secondary">
                                        <i class="bi bi-eye"></i>
                                    </span>
                                    <div id="confirm-password-error" class="invalid-feedback">Passwords do not match.</div>
                                </div>
                            </div>
                            <div id="error-banner" class="alert alert-danger d-none" role="alert"></div>
                            <div>
                                <button id="register-btn" type="submit" class="btn btn-warning w-100 fw-bold border border-primary text-dark" disabled>Sign Up</button>
                            </div>
                        </form>
                        <div class="mt-3 text-center">
                            <small role="button" id="login-link" class="text-warning fw-bold" style="cursor: pointer;">
                                Already have an account? Log In
                            </small>
                        </div>
                    </div>
                </main>
            </div>
        `;
	}
	postRender() {
		this.elements = {
			username: this.querySelector("#username"),
			email: this.querySelector("#email"),
			password: this.querySelector("#password"),
			confirmPassword: this.querySelector("#confirm-password"),
			togglePassword: this.querySelector("#toggle-password-visibility"),
			toggleConfirmPassword: this.querySelector(
				"#toggle-confirm-password-visibility"
			),
			registerButton: this.querySelector("#register-btn"),
			errorBanner: this.querySelector("#error-banner"),
			form: this.querySelector("#registration-form"),
			loginLink: this.querySelector("#login-link"),
			usernameError: this.querySelector("#username-error"),
			emailError: this.querySelector("#email-error"),
			passwordError: this.querySelector("#password-error"),
			confirmPasswordError: this.querySelector("#confirm-password-error"),
		};

		this.state = {
			showPassword: false,
		};

		this.#setupEventListeners();
		this.#checkErrorState();
	}

	#setupEventListeners() {
		this.elements.username.addEventListener(
			"input",
			this.#handleUsernameInput.bind(this)
		);
		this.elements.email.addEventListener(
			"input",
			this.#handleEmailInput.bind(this)
		);
		this.elements.password.addEventListener(
			"input",
			this.#handlePasswordInput.bind(this)
		);
		this.elements.confirmPassword.addEventListener(
			"input",
			this.#handleConfirmPasswordInput.bind(this)
		);

		this.elements.togglePassword.addEventListener("click", () =>
			this.switchPasswordVisibility(
				this.elements.password,
				this.elements.togglePassword
			)
		);
		this.elements.toggleConfirmPassword.addEventListener("click", () =>
			this.switchPasswordVisibility(
				this.elements.confirmPassword,
				this.elements.toggleConfirmPassword
			)
		);

		this.elements.form.addEventListener(
			"submit",
			this.#submitForm.bind(this)
		);
		this.elements.loginLink.addEventListener("click", () => {
			window.location.href = "/login";
		});
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

	#handleUsernameInput() {
		const { validity, message } = isValidUsername(
			this.elements.username.value
		);
		this.#updateFieldValidity("username", validity, message);
	}

	#handleEmailInput() {
		const { validity, message } = isValidEmail(this.elements.email.value);
		this.#updateFieldValidity("email", validity, message);
	}

	#handlePasswordInput() {
		const { validity, message } = isValidSecurePassword(
			this.elements.password.value
		);
		this.#updateFieldValidity("password", validity, message);
		this.#comparePasswords();
	}

	#handleConfirmPasswordInput() {
		this.#comparePasswords();
	}
	#comparePasswords() {
		const password = this.elements.password.value;
		const confirmPassword = this.elements.confirmPassword.value;
		const isMatching =
			password && confirmPassword && password === confirmPassword;
		const message = isMatching
			? ""
			: password && confirmPassword
			? "Passwords do not match."
			: "";

		this.#updateFieldValidity("confirmPassword", isMatching, message);
	}

	#updateFieldValidity(field, isValid, message = "") {
		const inputElement = this.elements[field];
		const errorMessageElement = this.elements[`${field}Error`];
		this.validations[field] = isValid;
		if (errorMessageElement) {
			if (isValid) {
				inputElement.classList.remove("is-invalid");
				inputElement.classList.add("is-valid");
				errorMessageElement.textContent = "";
			} else {
				inputElement.classList.remove("is-valid");
				inputElement.classList.add("is-invalid");
				errorMessageElement.textContent = message;
			}
		} else {
			console.error(`Error message element for ${field} not found.`);
		}

		this.#updateFormState();
	}

	#updateFormState() {
		const isFormValid = Object.values(this.validations).every(
			(value) => value
		);
		this.elements.registerButton.disabled = !isFormValid;
	}
	startLoadButton() {
		this.elements.registerButton.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span class="sr-only">Loading...</span>
        `;
		this.elements.registerButton.disabled = true;
	}

	async #submitForm(event) {
		event.preventDefault();
		this.startLoadButton();

		const { success, error } = await register({
			username: this.elements.username.value,
			email: this.elements.email.value,
			password: this.elements.password.value,
		});
		if (success) {
			this.#initializeTwoFactorAuth();
		} else {
			this.elements.registerButton.innerHTML = "Sign Up";
			this.elements.registerButton.disabled = false;
			this.#showErrorBanner(error);
		}
	}

	async #initializeTwoFactorAuth() {
		await import("./TwoFactorAuth.js");
		const container = this.querySelector("#container");
		if (!container) {
			console.error("Container not found. Unable to load 2FA component.");
			return;
		}
		container.innerHTML = "";
		container.style.justifyContent = "center";
		container.style.alignItems = "center";
		const twoFactorComponent = document.createElement("tfa-component");
		twoFactorComponent.login = this.elements.username.value;
		container.appendChild(twoFactorComponent);
	}

	#showErrorBanner(message) {
		this.errorState.active = true;
		this.errorState.message = message;
		this.elements.errorBanner.textContent = message;
		this.elements.errorBanner.classList.remove("d-none");
	}

	#checkErrorState() {
		if (this.errorState.active) {
			this.#showErrorBanner(this.errorState.message);
			this.errorState.active = false;
		}
	}
}

customElements.define("sign-up-page", SignUpPage);
