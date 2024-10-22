import { login } from "../js/clients/token-client.js";

export class SignInContent extends Component {
	constructor() {
		super();
		this.isValidEmailInput = false;
		this.isValidPasswordInput = false;
		this.passwordHiden = true;

		this.error = false;
		this.errorMessage = "";
	}

	render() {
		// const { render } = this.#OAuthReturn();
		// if (!render) {
		// 	return false;
		// }
		this.innerHTML = `

    `;
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
	// 		getRouter().navigate("/");
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

customElements.define("signin-content", SignInContent);
