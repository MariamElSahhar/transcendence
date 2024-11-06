import { Component } from "../Component.js";
import { InputValidator } from "../../../js/utils/input-validator.js";
import { BootstrapUtils } from "../../../js/utils/bootstrap-utils.js";
// import { userManagementClient } from '@utils/api';
import { ErrorPage } from "../../utils/ErrorPage.js";
import { NavbarUtils } from "../../utils/NavbarUtils.js";

export class ResetPasswordEmail extends Component {
	constructor() {
		super();
	}
	render() {
		return `
			<div class="reset-password-card card m-3">
				<div class="card-body m-2">
					<h2 class="card-title text-center m-5">Reset password</h2>
					<form id="reset-password-form">
						<div class="d-flex justify-content-center mb-4">
							<i class="bi bi-envelope-at-fill" style="font-size: 5rem;"></i>
						</div>
						<div class="form-group mb-4">
							<input type="email" class="form-control" id="email" placeholder="Email" autocomplete="email">
							<div id="email-feedback" class="invalid-feedback">
								Please enter a valid email.
							</div>
						</div>
						<alert-component id="alert-form" alert-display="false"></alert-component>
						<div class="d-flex justify-content-center w-100">
							<button id="sendEmailBtn" type="submit" class="btn btn-primary w-100" disabled>Send email</button>
						</div>
					</form>
				</div>
			</div>
		`;
	}

	postRender() {
		this.email = this.querySelector("#email");
		this.emailFeedback = this.querySelector("#email-feedback");
		this.sendEmailBtn = this.querySelector("#sendEmailBtn");
		this.form = this.querySelector("#reset-password-form");
		this.alertForm = this.querySelector("#alert-form");

		super.addComponentEventListener(
			this.email,
			"input",
			this.#emailHandler
		);
		super.addComponentEventListener(this.form, "submit", (event) => {
			event.preventDefault();
			this.#sendEmail();
		});
	}

	#emailHandler() {
		const { validity, missingRequirements } = InputValidator.isValidEmail(
			this.email.value
		);
		if (validity) {
			BootstrapUtils.setValidInput(this.email);
			this.InputValidEmail = true;
			this.sendEmailBtn.disabled = false;
		} else {
			BootstrapUtils.setInvalidInput(this.email);
			this.emailFeedback.innerHTML = missingRequirements[0];
			this.InputValidEmail = false;
			this.sendEmailBtn.disabled = true;
		}
	}

	async #sendEmail() {
		this.#startLoadButton();
		try {
			const { response, body } =
				await userManagementClient.sendResetPasswordCode(
					this.email.value
				);
			if (response.ok) {
				this.#notifyEmailSent();
			} else {
				this.#resetLoadButton();
				this.alertForm.setAttribute("alert-message", body.errors[0]);
				this.alertForm.setAttribute("alert-display", "true");
			}
		} catch (error) {
			ErrorPage.loadNetworkError();
		}
	}

	#notifyEmailSent() {
		// Dispatches an event to notify that the email has been successfully sent
		const emailEvent = new CustomEvent("emailSent", {
			detail: { email: this.email.value },
		});
		this.dispatchEvent(emailEvent);
	}

	#startLoadButton() {
		this.sendEmailBtn.innerHTML = `
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
			<span class="sr-only">Loading...</span>
		`;
		this.sendEmailBtn.disabled = true;
	}

	#resetLoadButton() {
		this.sendEmailBtn.innerHTML = "Send email";
		this.sendEmailBtn.disabled = false;
	}
}

// Define the custom element for this component
customElements.define("reset-password-email-component", ResetPasswordEmail);
