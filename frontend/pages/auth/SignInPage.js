import { Component } from "../Component.js";
import { isAuth } from "../../js/utils/session-manager.js";
import { login } from "../../js/clients/token-client.js";
export class SignInPage extends Component {
	constructor() {
		super();
		this.isValidEmailInput = false;
		this.isValidPasswordInput = false;
		this.passwordHiden = true;
		this.error = false;
		this.errorMessage = "";
	}

	async connectedCallback() {
		await import("./IntraButton.js");
		super.connectedCallback();
	}

	render() {
		return `
			<div class="d-flex flex-column w-100 vh-100">
				<h3 class="w-100 py-2">
					<i role="button" class="bi bi-arrow-left p-2 mx-2" onclick="window.redirect('/')"></i>
				</h3>
				<div id="container" class="d-flex justify-content-center align-items-start mt-5 rounded-3">
					<div class="login-card card m-3">
						<div class="card-body m-2">
							<h2 class="card-title text-center m-5">Sign In</h2>
							<form id="signin-form">
								<div class="form-group mb-4">
									<input type="text" class="form-control" id="login"
										placeholder="Username">
									<div id="login-feedback" class="invalid-feedback">
										Please enter a valid login.
									</div>
								</div>
								<div class="form-group mb-4">
									<div class="input-group">
										<input type="password" class="form-control"
											id="password"
											placeholder="Password">
										<span id="password-eye"
											class="input-group-text dynamic-hover">
											<i class="bi bi-eye-fill"></i>
										</span>
									</div>
								</div>
								<div id="alert-form" class="d-none alert alert-danger" role="alert"></div>
								<div class="d-flex mb-3">
									<small role="button" id="dont-have-account">Don't have an account? Sign up</small>
								</div>
								<button id="signin-btn" class="btn btn-primary w-100" type="submit" disabled>Sign in</button>
							</form>
							<hr class="my-4">
							<intra-button-component class="p-0"></intra-button-component>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	postRender() {
		this.forgotPassword = this.querySelector("#forgot-password");
		this.donthaveAccount = this.querySelector("#dont-have-account");
		this.signinBtn = this.querySelector("#signin-btn");
		this.signinForm = this.querySelector("#signin-form");
		this.login = this.querySelector("#login");
		this.password = this.querySelector("#password");
		this.passwordEyeIcon = this.querySelector("#password-eye");
		this.alertForm = this.querySelector("#alert-form");

		super.addComponentEventListener(this.forgotPassword, "click", () => {
			window.redirect("/reset-password");
			// alert("redirect to /reset-password");
		});
		super.addComponentEventListener(this.donthaveAccount, "click", () => {
			window.redirect("/sign-up");
		});
		super.addComponentEventListener(this.signinForm, "submit", (event) => {
			event.preventDefault();
			this.#signin();
		});
		super.addComponentEventListener(
			this.login,
			"input",
			this.#loginHandler
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
		if (this.error) {
			this.alertForm.innerHTML = this.errorMessage;
			this.alertForm.classList.remove("d-none");
			this.error = false;
		}
	}

	#renderLoader() {
		return `
    	<div class="d-flex justify-content-center align-items-center" style="height: 700px">
          <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
          </div>
      </div>
    `;
	}

	#loginHandler() {
		this.isValidEmailInput = this.login.value.length > 0;
		this.#formHandler();
	}

	#passwordHandler() {
		this.isValidPasswordInput = this.password.value.length > 0;
		this.#formHandler();
	}

	#formHandler() {
		this.signinBtn.disabled = !(
			this.isValidEmailInput && this.isValidPasswordInput
		);
	}

	async #signin() {
		this.#startLoadButton();
		const { success, error } = await login({
			username: this.login.value,
			password: this.password.value,
		});
		if (success) {
			this.alertForm.classList.add("d-none");
			const authenticated = await isAuth();
			console.log(authenticated);
			if (authenticated) {
				window.redirect("/home");
				return false;
			} else {
				this.#loadTwoFactorComponent();
			}
		} else {
			// if (body.hasOwnProperty("2fa") && body["2fa"] === true) {
			// 	this.#loadTwoFactorComponent();
			// 	return;
			// }
			this.#resetLoadButton();
			this.alertForm.innerHTML = error;
			this.alertForm.classList.remove("d-none");
		}
	}

	async #loadTwoFactorComponent() {
		await import("./TwoFactorAuth.js");
		const container = this.querySelector("#container");
		container.innerHTML = "";
		const twoFactorComponent = document.createElement("tfa-component");
		twoFactorComponent.login = this.login.value;
		container.appendChild(twoFactorComponent);
	}

	/* #OAuthReturn() {
		if (!this.#isOAuthError()) {
			return { render: true };
		}
		const refreshToken = Cookies.get("refresh_token");
		Cookies.remove("refresh_token");
		if (new JWT(refreshToken).isValid()) {
			// this.#loadAndCache(refreshToken);
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

	async #loadAndCache(refreshToken) {
		this.innerHTML = this.#renderLoader();
		userManagementClient.refreshToken = refreshToken;
		if (!(await userManagementClient.restoreCache())) {
			userManagementClient.logout();
			this.error = true;
			this.errorMessage = "Error, failed to store cache";
			super.update();
			this.postRender();
		} else {
			window.redirect("/");
		}
	} */

	#togglePasswordVisibility() {
		if (this.passwordHiden) {
			this.password.setAttribute("type", "text");
		} else {
			this.password.setAttribute("type", "password");
		}
		this.passwordEyeIcon.children[0].classList.toggle("bi-eye-fill");
		this.passwordEyeIcon.children[0].classList.toggle("bi-eye-slash-fill");
		this.passwordHiden = !this.passwordHiden;
	}

	#startLoadButton() {
		this.signinBtn.innerHTML = `
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
			<span class="sr-only">Loading...</span>
    	`;
		this.signinBtn.disabled = true;
	}

	#resetLoadButton() {
		this.signinBtn.innerHTML = "Sign in";
		this.signinBtn.disabled = false;
	}
}

customElements.define("sign-in-page", SignInPage);
