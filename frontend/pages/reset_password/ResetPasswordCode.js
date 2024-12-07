import { Component } from "../Component.js";
import { Keys } from "../../../js/utils/keys.js";
import { ErrorPage } from "../error/ErrorPage.js";

export class ResetPasswordCode extends Component {
	constructor() {
		super();
	}

	render() {
		return `
			<div class="reset-password-card card m-3">
				<div class="card-body m-2">
					<h2 class="card-title text-center m-5">Reset password</h2>
					<p class="text-center">Enter the 6-digit code received by email</p>
					<form id="form">
						<div class="d-flex justify-content-center mb-4">
							<i class="bi bi-shield-lock-fill" style="font-size: 5rem;"></i>
						</div>
						<div class="form-group row mb-4">
							<input class="code-input form-control text-center col" type="tel" name="pincode-1" maxlength="1" pattern="[\\d]*" tabindex="1" placeholder="·" autocomplete="off">
							<input class="code-input form-control text-center col" type="tel" name="pincode-2" maxlength="1" pattern="[\\d]*" tabindex="2" placeholder="·" autocomplete="off">
							<input class="code-input form-control text-center col" type="tel" name="pincode-3" maxlength="1" pattern="[\\d]*" tabindex="3" placeholder="·" autocomplete="off">
							<input class="code-input form-control text-center col" type="tel" name="pincode-4" maxlength="1" pattern="[\\d]*" tabindex="4" placeholder="·" autocomplete="off">
							<input class="code-input form-control text-center col" type="tel" name="pincode-5" maxlength="1" pattern="[\\d]*" tabindex="5" placeholder="·" autocomplete="off">
							<input class="code-input form-control text-center col" type="tel" name="pincode-6" maxlength="1" pattern="[\\d]*" tabindex="6" placeholder="·" autocomplete="off">
						</div>
						<alert-component id="alert-form" alert-display="false"></alert-component>
						<div class="d-flex justify-content-center w-100">
							<button id="sendCodeBtn" type="submit" class="btn btn-primary w-100" disabled>Send code</button>
						</div>
					</form>
				</div>
			</div>
		`;
	}

	postRender() {
		this.inputs = this.querySelectorAll("input");
		this.sendCodeBtn = this.querySelector("#sendCodeBtn");
		this.alertForm = this.querySelector("#alert-form");

		for (const input of this.inputs) {
			super.addComponentEventListener(
				input,
				"keydown",
				this.#handleInputChange
			);
			super.addComponentEventListener(input, "paste", this.#handlePaste);
		}
		super.addComponentEventListener(this.sendCodeBtn, "click", (event) => {
			event.preventDefault();
			this.#sendCode();
		});
	}

	#handleInputChange(event) {
		if (!Keys.isPasteShortcut(event)) {
			event.preventDefault();
		}
		if (!Keys.isDigitKey(event) && !Keys.isDeleteKey(event)) {
			event.target.value = "";
			return;
		}
		if (Keys.isDeleteKey(event)) {
			event.target.value = "";
			this.#focusPreviousInput(event.target);
			return;
		}
		event.target.value = Keys.getDigitValue(event);
		this.#formHandler();
		this.#focusNextInput(event.target);
	}

	#handlePaste(event) {
		event.preventDefault();
		const clipboardData = event.clipboardData || window.clipboardData;
		const pastedText = clipboardData.getData("text").replace(/\D/g, "");
		let currentInput = event.target;
		for (let i = 0; i < pastedText.length && currentInput !== null; i++) {
			currentInput.value = pastedText[i];
			this.#formHandler();
			currentInput = this.#focusNextInput(currentInput);
		}
	}

	#formHandler() {
		for (const input of this.inputs) {
			if (!input.value) {
				this.sendCodeBtn.disabled = true;
				return;
			}
		}
		this.sendCodeBtn.disabled = false;
	}

	async #sendCode() {
		this.#startLoadButton();
		this.code = Array.from(this.inputs)
			.map((input) => input.value)
			.join("");
		try {
			const { response, body } =
				await userManagementClient.checkResetPasswordCode(
					this.email,
					this.code
				);
			if (response.ok) {
				this.#notifyCodeVerified();
			} else {
				this.#resetLoadButton();
				this.alertForm.setAttribute("alert-message", body.errors[0]);
				this.alertForm.setAttribute("alert-display", "true");
			}
		} catch (error) {
			ErrorPage.loadNetworkError();
		}
	}

	#notifyCodeVerified() {
		// Dispatches an event to notify that the code has been verified
		const codeEvent = new CustomEvent("codeVerified", {
			detail: { code: this.code },
		});
		this.dispatchEvent(codeEvent);
	}

	#focusPreviousInput(input) {
		const previousInput = input.previousElementSibling;
		if (previousInput) {
			previousInput.focus();
			return previousInput;
		}
		return null;
	}

	#focusNextInput(input) {
		const nextInput = input.nextElementSibling;
		if (nextInput) {
			nextInput.focus();
			return nextInput;
		}
		return null;
	}

	#startLoadButton() {
		this.sendCodeBtn.innerHTML = `
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
			<span class="sr-only">Loading...</span>
		`;
		this.sendCodeBtn.disabled = true;
	}

	#resetLoadButton() {
		this.sendCodeBtn.innerHTML = "Send code";
		this.sendCodeBtn.disabled = false;
	}
}

customElements.define("reset-password-code-component", ResetPasswordCode);
