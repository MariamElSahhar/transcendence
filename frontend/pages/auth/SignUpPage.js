import { Component } from "../Component.js";
import { isAuth } from "../../js/utils/session-manager.js";
import { register } from "../../js/clients/token-client.js";
import { InputValidator } from "../../js/utils/input-validator.js";
import {
	setValidInput,
	setInvalidInput,
} from "../../js/utils/validity-toggle.js";

export class SignUpPage extends Component {
	constructor() {
		super();
		this.passwordHidden = true;
		this.confirmPasswordHidden = true;
		this.startConfirmPassword = false;

		this.InputValidUsername = false;
		this.InputValidEmail = false;
		this.InputValidPassword = false;
		this.InputValidConfirmPassword = false;

		this.error = false;
		this.errorMessage = "";
	}

	render() {
		// const { render } = this.#OAuthReturn();
		// if (!render) {
		// 	return false;
		// }
		return `
			<div class="d-flex flex-column w-100 vh-100">
				<h3 class="w-100 py-2">
					<i role="button" class="bi bi-arrow-left p-2 mx-2" onclick="window.redirect('/')"></i>
				</h3>
				<div id="container" class="d-flex justify-content-center align-items-center rounded-3 flex-grow-1">
					<div class="register-card card m-3">
						<div class="card-body m-2">
							<h2 class="card-title text-center m-5 dynamic-hover">Sign Up</h2>
							<form id="signup-form">
								<div class="form-group mb-4">
									<div class="input-group has-validation">
										<span class="input-group-text" id="inputGroupPrepend">@</span>
										<input type="text" class="form-control" id="username"
												placeholder="Username" autocomplete="username">
										<div id="username-feedback" class="invalid-feedback">
											Invalid username.
										</div>
									</div>
								</div>
								<div class="form-group mb-4">
									<input type="email" class="form-control" id="email"
											placeholder="Email" autocomplete="email">
									<div id="email-feedback" class="invalid-feedback">
										Please enter a valid email.
									</div>
								</div>
								<div class="form-group mb-4">
									<div class="input-group has-validation">
										<input type="password" class="form-control"
												id="password"
												placeholder="Password">
										<span id="password-eye" class="input-group-text dynamic-hover">
											<i class="bi bi-eye-fill"></i>
										</span>
										<div id="password-feedback" class="invalid-feedback">
											Invalid password.
										</div>
									</div>
								</div>
								<div class="form-group mb-4">
									<div class="input-group has-validation">
										<input type="password" class="form-control"
												id="confirm-password"
												placeholder="Confirm Password">
										<span id="confirm-password-eye"
											class="input-group-text dynamic-hover">
											<i class="bi bi-eye-fill"></i>
										</span>
										<div id="confirm-password-feedback" class="invalid-feedback">
											Passwords do not match.
										</div>
									</div>
								</div>
								<div id="alert-form" class="d-none alert alert-danger" role="alert"></div>
								<div class="mb-3">
									<small role="button" id="have-account">Already have an account? Log In</small>
								</div>
								<button id="signupBtn" type="submit" class="btn btn-primary w-100" disabled>Sign up</button>
							</form>
							<hr class="my-4">
						</div>
					</div>
				</div>
			</div>
		`;
	}

	postRender() {
		this.username = this.querySelector("#username");
		this.usernameFeedback = this.querySelector("#username-feedback");
		this.email = this.querySelector("#email");
		this.emailFeedback = this.querySelector("#email-feedback");
		this.password = this.querySelector("#password");
		this.passwordEyeIcon = this.querySelector("#password-eye");
		this.passwordFeeback = this.querySelector("#password-feedback");
		this.confirmPassword = this.querySelector("#confirm-password");
		this.confirmPasswordEyeIcon = this.querySelector(
			"#confirm-password-eye"
		);
		this.confirmPasswordFeedback = this.querySelector(
			"#confirm-password-feedback"
		);
		this.haveAccount = this.querySelector("#have-account");
		this.alertForm = this.querySelector("#alert-form");
		this.signupBtn = this.querySelector("#signupBtn");
		this.signupForm = this.querySelector("#signup-form");

		super.addComponentEventListener(
			this.username,
			"input",
			this.#usernameHandler
		);
		super.addComponentEventListener(
			this.email,
			"input",
			this.#emailHandler
		);
		super.addComponentEventListener(
			this.password,
			"input",
			this.#passwordHandler
		);
		super.addComponentEventListener(
			this.passwordEyeIcon,
			"click",
			this.#togglePasswordVisibility
		);
		super.addComponentEventListener(
			this.confirmPassword,
			"input",
			this.#confirmPasswordHandler
		);
		super.addComponentEventListener(
			this.confirmPasswordEyeIcon,
			"click",
			this.#toggleConfirmPasswordVisibility
		);
		super.addComponentEventListener(this.haveAccount, "click", () =>
			window.redirect("/sign-in")
		);
		super.addComponentEventListener(this.signupForm, "submit", (event) => {
			event.preventDefault();
			this.#signupHandler();
		});
		if (this.error) {
			this.alertForm.innerHTML = this.errorMessage;
			this.alertForm.classList.remove("d-none");
			this.error = false;
		}
	}

	async #usernameHandler() {
		clearTimeout(this.usernameTimeout);
		const { validity, missingRequirements } =
			InputValidator.isValidUsername(this.username.value);
		if (validity) {
			this.#setUsernameInputValidity(true);
		} else {
			this.#setUsernameInputValidity(false, missingRequirements[0]);
		}
	}

	#setUsernameInputValidity(validity, message = "") {
		if (validity) {
			setValidInput(this.username);
			this.InputValidUsername = true;
		} else {
			setInvalidInput(this.username);
			this.usernameFeedback.innerHTML = message;
			this.InputValidUsername = false;
		}
		this.#formHandler();
	}

	#emailHandler() {
		clearTimeout(this.emailTimeout);
		const { validity, missingRequirements } = InputValidator.isValidEmail(
			this.email.value
		);
		if (validity) {
			this.#setEmailInputValidity(true);
		} else {
			this.#setEmailInputValidity(false, missingRequirements[0]);
		}
	}

	#setEmailInputValidity(validity, message = "") {
		if (validity) {
			setValidInput(this.email);
			this.InputValidEmail = true;
		} else {
			setInvalidInput(this.email);
			this.emailFeedback.innerHTML = message;
			this.InputValidEmail = false;
		}
		this.#formHandler();
	}

	#passwordHandler() {
		const { validity, missingRequirements } =
			InputValidator.isValidSecurePassword(this.password.value);
		if (validity) {
			this.#setInputPasswordValidity(true);
			if (this.startConfirmPassword) {
				if (this.confirmPassword.value === this.password.value) {
					this.#setInputConfirmPasswordValidity(true);
				} else {
					this.#setInputConfirmPasswordValidity(
						false,
						"Passwords do not match."
					);
				}
			}
		} else {
			this.#setInputPasswordValidity(false, missingRequirements[0]);
			if (this.startConfirmPassword) {
				this.#setInputConfirmPasswordValidity(false);
			}
		}
	}

	#confirmPasswordHandler() {
		if (!this.startConfirmPassword) {
			this.startConfirmPassword = true;
		}
		this.#passwordHandler();
	}

	#setInputPasswordValidity(validity, message = "") {
		if (validity) {
			setValidInput(this.password);
			this.InputValidPassword = true;
		} else {
			setInvalidInput(this.password);
			this.passwordFeeback.innerHTML = message;
			this.InputValidPassword = false;
		}
		this.#formHandler();
	}

	#setInputConfirmPasswordValidity(validity, message = "") {
		if (validity) {
			setValidInput(this.confirmPassword);
			this.InputValidConfirmPassword = true;
		} else {
			setInvalidInput(this.confirmPassword);
			this.confirmPasswordFeedback.innerHTML = message;
			this.InputValidConfirmPassword = false;
		}
		this.#formHandler();
	}

	#togglePasswordVisibility() {
		if (this.passwordHidden) {
			this.password.setAttribute("type", "text");
		} else {
			this.password.setAttribute("type", "password");
		}
		this.passwordEyeIcon.children[0].classList.toggle("bi-eye-fill");
		this.passwordEyeIcon.children[0].classList.toggle("bi-eye-slash-fill");
		this.passwordHidden = !this.passwordHidden;
	}

	#toggleConfirmPasswordVisibility() {
		if (this.confirmPasswordHidden) {
			this.confirmPassword.setAttribute("type", "text");
		} else {
			this.confirmPassword.setAttribute("type", "password");
		}
		this.confirmPasswordEyeIcon.children[0].classList.toggle("bi-eye-fill");
		this.confirmPasswordEyeIcon.children[0].classList.toggle(
			"bi-eye-slash-fill"
		);
		this.confirmPasswordHidden = !this.confirmPasswordHidden;
	}

	#formHandler() {
		if (
			this.InputValidUsername &&
			this.InputValidEmail &&
			this.InputValidPassword &&
			this.InputValidConfirmPassword
		) {
			this.signupBtn.disabled = false;
		} else {
			this.signupBtn.disabled = true;
		}
	}

	async #signupHandler() {
		this.#startLoadButton();
		const { success, error } = await register({
			username: this.username.value,
			email: this.email.value,
			password: this.password.value,
		});
		if (success) {
			this.alertForm.classList.add("d-none");
			this.#loadTwoFactorComponent();
		} else {
			this.#resetLoadButton();
			this.alertForm.innerHTML = error;
			this.alertForm.classList.remove("d-none");
		}
	}

	/* #OAuthReturn() {
		if (!this.#isOAuthError()) {
			return { render: true };
		}
		const refreshToken = Cookies.get("refresh_token");
		Cookies.remove("refresh_token");
		if (new JWT(refreshToken).isValid()) {
			this.#loadAndCache(refreshToken);
			return { render: false };
		}
		return { render: true };
	}

	#isOAuthError() {
		const params = new URLSearchParams(window.location.search);
		if (params.has("error")) {
			this.error = true;
			this.errorMessage = params.get("error");
			return false;
		}
		return true;
	}
	*/

	#startLoadButton() {
		this.signupBtn.innerHTML = `
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
			<span class="sr-only">Loading...</span>
    	`;
		this.signupBtn.disabled = true;
	}

	#resetLoadButton() {
		this.signupBtn.innerHTML = "Sign up";
		this.signupBtn.disabled = false;
	}

	async #loadTwoFactorComponent() {
		await import("./TwoFactorAuth.js");
		const container = this.querySelector("#container");
		container.innerHTML = "";
		const twoFactorComponent = document.createElement("tfa-component");
		twoFactorComponent.login = this.username.value;
		container.appendChild(twoFactorComponent);
	}
}

customElements.define("sign-up-page", SignUpPage);
