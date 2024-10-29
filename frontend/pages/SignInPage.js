import { Component } from "./components/Component.js";
import { login, isAuth } from "../js/clients/token-client.js";

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
		await import("./components/navbar/Navbar.js");
		await import("./components/buttons/IntraButton.js");
		// const authenticated = await isAuth();
		const authenticated = false;
		if (authenticated) {
			window.redirect("/");
			return false;
		}
		super.connectedCallback();
	}

	render() {
		return `
			<navbar-component></navbar-component>
			<div id="container">
			<div id="login-card w-550"
				class="d-flex justify-content-center align-items-center rounded-3">
				<div class="login-card card m-3">
					<div class="card-body m-2">
						<h2 class="card-title text-center m-5">Sign in</h2>
						<form id="signin-form">
							<div class="form-group mb-4">
								<input type="text" class="form-control" id="login"
									placeholder="Username or email">
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
							<alert-component id="alert-form" alert-dispaly="false">
							</alert-component>
							<div class="d-flex justify-content-between mb-3">
								<a id="dont-have-account">Don't have an account?</a>
								<a id="forgot-password">Forgot pasword?</a>
							</div>
							<div class="row d-flex justify-content-center">
								<button id="signin-btn" class="btn btn-primary" disabled>Sign in
								</button>
							</div>
						</form>
						<hr class="my-4">
						<div class="row">
						<intra-button-component class="p-0"></intra-button-component>
						</div>
					</div>
				</div>
			</div>
		</div>
		`;
	}

	style() {
		return `
		<style>
			#login-card {
				height: 700px;
			}

			.login-card {
				width: 550px;
			}

			#forgot-password, #dont-have-account {
				font-size: 13px;
			}
		</style>
    	`;
	}

	postRender() {
		this.forgotPassword = this.querySelector("#forgot-password");
		super.addComponentEventListener(this.forgotPassword, "click", () => {
			window.redirect("/reset-password/");
		});
		this.donthaveAccount = this.querySelector("#dont-have-account");
		super.addComponentEventListener(this.donthaveAccount, "click", () => {
			window.redirect("/signup/");
		});
		this.signinBtn = this.querySelector("#signin-btn");
		super.addComponentEventListener(this.signinBtn, "click", (event) => {
			event.preventDefault();
			this.#signin();
		});
		this.signinForm = this.querySelector("#signin-form");
		super.addComponentEventListener(this.signinForm, "submit", (event) => {
			event.preventDefault();
			this.#signin();
		});
		this.login = this.querySelector("#login");
		super.addComponentEventListener(
			this.login,
			"input",
			this.#loginHandler
		);
		this.password = this.querySelector("#password");
		this.passwordEyeIcon = this.querySelector("#password-eye");
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

		this.alertForm = this.querySelector("#alert-form");
		if (this.error) {
			this.alertForm.setAttribute("alert-message", this.errorMessage);
			this.alertForm.setAttribute("alert-display", "true");
			this.error = false;
		}
	}

	reRender() {
		super.update();
		this.postRender();
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
		try {
			const { success, error } = await login({
				username: this.login.value,
				password: this.password.value,
			});
			if (success) {
				// this.#loadAndCache(body.refresh_token);
				window.redirect("/");
			} else {
				// if (body.hasOwnProperty("2fa") && body["2fa"] === true) {
				// 	this.#loadTwoFactorComponent();
				// 	return;
				// }
				this.#resetLoadButton();
				this.alertForm.setAttribute("alert-message", error);
				this.alertForm.setAttribute("alert-display", "true");
			}
		} catch (error) {
			ErrorPage.loadNetworkError();
		}
	}

	#loadTwoFactorComponent() {
		const twoFactorComponent = document.createElement(
			"two-factor-auth-component"
		);
		twoFactorComponent.login = this.login.value;
		twoFactorComponent.password = this.password.value;
		const container = this.querySelector("#container");
		container.innerHTML = "";
		container.appendChild(twoFactorComponent);
	}

	#OAuthReturn() {
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

	// async #loadAndCache(refreshToken) {
	// 	this.innerHTML = this.#renderLoader();
	// 	userManagementClient.refreshToken = refreshToken;
	// 	if (!(await userManagementClient.restoreCache())) {
	// 		userManagementClient.logout();
	// 		this.error = true;
	// 		this.errorMessage = "Error, failed to store cache";
	// 		this.reRender();
	// 	} else {
	// 		window.redirect("/");
	// 	}
	// }

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
