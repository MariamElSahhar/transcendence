import { Component } from "../Component.js";
import { register } from "../../scripts/clients/token-client.js";
import {
	isValidSecurePassword,
	isValidUsername,
	isValidEmail,
} from "../../scripts/utils/input-validator.js";
import { Footer } from "../../layouts/components/Footer.js";

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
            <div
           id="container"
				class="d-flex flex-column w-100 vh-100"
				style="background-color: rgb(135, 206, 235); position: relative; overflow: hidden;">
				<div class="sky" style="z-index:0"></div>
				<h3 class="w-100 py-2">
					<i role="button" class="bi bi-arrow-left p-2 mx-2" onclick="window.redirect('/')"></i>
				</h3>
                <main class="d-flex justify-content-center align-items-center flex-grow-1">
                    <div class="login-card card shadow p-5 mx-auto bg-light">

						<!-- Header -->
						<h2 class="m-0 w-100 text-center mb-3">Create an Account</h2>

						<!-- Form -->
                        <form id="registration-form" class="needs-validation" novalidate>

							<!-- Error -->
							<div id="error-banner" class="alert alert-danger d-none" role="alert"></div>

							<!-- Username -->
                            <div class="form-group mb-1">
                                <div class="input-group">
                                    <input type="text" class="form-control" id="username" placeholder="Username" required>
                                    <div id="username-error" class="invalid-feedback">Invalid username.</div>
                                </div>
                            </div>

							<!-- Email -->
                            <div class="form-group mb-1">
                                <div class="input-group">
                                    <input type="email" class="form-control" id="email" placeholder="Email" required>
                                    <div id="email-error" class="invalid-feedback">Invalid email address.</div>
                                </div>
                            </div>

							<!-- Password -->
                            <div class="form-group mb-1">
                                <div class="input-group">
                                    <input type="password" class="form-control" id="password" placeholder="Password" required>
                                    <span id="toggle-password-visibility" class="input-group-text">
                                        <i class="bi bi-eye"></i>
                                    </span>
                                    <div id="password-error" class="invalid-feedback">Invalid password.</div>
                                </div>
                            </div>

							<!-- Confirm Password -->
                            <div class="form-group mb-1">
                                <div class="input-group">
                                    <input type="password" class="form-control" id="confirm-password" placeholder="Confirm password" required>
                                    <span id="toggle-confirm-password-visibility" class="input-group-text">
                                        <i class="bi bi-eye"></i>
                                    </span>
                                    <div id="confirm-password-error" class="invalid-feedback">Passwords do not match.</div>
                                </div>
                            </div>

							<!-- Submit -->
							<div>
								<button id="register-btn" type="submit" class="btn w-100 mt-1" disabled>Sign Up</button>
							</div>
                        </form>

						<!-- Log In -->
                        <div class="text-center mt-2">
                            <small role="button" id="login-link">
                                Already have an account? <span class="text-decoration-underline">Log In</span></small>
                            </small>
                        </div>
                    </div>
					</main>
				<footer-component class="mt-auto"></footer-component>
            </div>
        `;
	}

	style() {
		return `<style>
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
		</style>
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

		try {
			const { success, error } = await register({
				username: this.elements.username.value,
				email: this.elements.email.value,
				password: this.elements.password.value,
			});

			if (success) {
				this.#renderTwoFactorAuth();
			} else {
				this.elements.registerButton.innerHTML = "Sign Up";
				this.elements.registerButton.disabled = false;
				this.#showErrorBanner(error);
			}
		} catch (err) {
			console.error("Error during registration:", err);
			this.elements.registerButton.innerHTML = "Sign Up";
			this.elements.registerButton.disabled = false;
			this.#showErrorBanner("An unexpected error occurred.");
		}
	}

	async #renderTwoFactorAuth() {
		await import("./TwoFactorAuth.js");
		const container = this.querySelector("main");
		container.innerHTML = "";
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
