// ResetPasswordPage.js

import { Component } from "./components/Component.js";

export class ResetPasswordPage extends Component {
	constructor() {
		super();
		this.currentStep = "email"; // Start at email step
		this.email = "";
		this.code = "";
		this.navbarHeight = 0; // Default height for navbar
	}

	async connectedCallback() {
		// Dynamically load the Navbar and other reset password components
		await import("./components/navbar/Navbar.js");
		await import("./components/reset_password/ResetPasswordEmail.js");
		await import("./components/reset_password/ResetPasswordCode.js");
		await import("./components/reset_password/ResetPasswordNew.js");

		// Render the HTML structure
		this.innerHTML = this.render();
		this.postRender();
	}

	render() {
		return `
			<div id="reset-password-page" class="h-100">
				<navbar-component></navbar-component>
				<div id="container" class="d-flex justify-content-center align-items-center h-100">${this.#renderCurrentComponent()}</div>
			</div>
		`;
	}

	#renderCurrentComponent() {
		switch (this.currentStep) {
			case "email":
				return `<reset-password-code-component></reset-password-code-component>`;
				return `<reset-password-email-component></reset-password-email-component>`;
			case "code":
			case "newPassword":
				return `<reset-password-new-component></reset-password-new-component>`;
			default:
				return `<reset-password-email-component></reset-password-email-component>`;
		}
	}

	postRender() {
		this.#loadComponent();
	}

	#loadComponent() {
		const container = this.querySelector("#container");
		container.innerHTML = this.#renderCurrentComponent();

		// Event listeners based on the current step
		if (this.currentStep === "email") {
			const emailComponent = container.querySelector(
				"reset-password-email-component"
			);
			emailComponent.addEventListener("emailSent", (event) => {
				this.email = event.detail.email;
				this.currentStep = "code";
				this.#loadComponent();
			});
		} else if (this.currentStep === "code") {
			const codeComponent = container.querySelector(
				"reset-password-code-component"
			);
			codeComponent.email = this.email;
			codeComponent.addEventListener("codeVerified", (event) => {
				this.code = event.detail.code;
				this.currentStep = "newPassword";
				this.#loadComponent();
			});
		} else if (this.currentStep === "newPassword") {
			const newPasswordComponent = container.querySelector(
				"reset-password-new-component"
			);
			newPasswordComponent.email = this.email;
			newPasswordComponent.code = this.code;
			newPasswordComponent.addEventListener("passwordChanged", () => {
				window.redirect("/sign-in"); // Redirect to sign-in page after successful reset
			});
		}
	}
}

// Define the custom element for ResetPasswordPage
customElements.define("reset-password-page", ResetPasswordPage);
