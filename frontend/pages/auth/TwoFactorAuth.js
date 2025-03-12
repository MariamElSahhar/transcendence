import { Component } from "../Component.js";
import { verifyOTP } from "../../scripts/clients/token-client.js";

export class TwoFactorAuth extends Component {
	constructor() {
		super();
		this.otpInputs = [];
		this.submitButton = null;
		this.errorNotification = null;
	}

	render() {
		return `
		<main class="d-flex justify-content-center align-items-center flex-grow-1">
			<div class="card shadow p-5 mx-auto rounded bg-light">
				<h2 class="m-0 w-100 text-center mb-3">Verify Your OTP</h2>
				<p class="text-center mb-2">Enter the 6-digit code from your email and let’s-a go!</p>

				<!-- Form -->
				<form>
					<!-- Error Alert -->
					<div id="error-alert" class="alert alert-danger d-none" role="alert"></div>

					<!-- OTP Input Fields -->
					<div class="input-fields form-group mb-2 w-100 d-flex justify-content-between">
						${this.renderOtpInputs()}
					</div>

					<!-- Submit Button -->
					<button id="submit-button" type="submit" class="btn btn-warning w-100 fw-bold" disabled>
					Confirm
					</button>
				</form>
			</div>
		</main>
    `;
	}

	style() {
		return `
		<style>
			.form-control {
				line-height: 2;
			}
		</style>`;
	}

	postRender() {
		this.otpInputs = this.querySelectorAll("input");
		this.submitButton = this.querySelector("#submit-button");
		this.errorNotification = this.querySelector("#error-alert");

		this.otpInputs.forEach((input) => {
			super.addComponentEventListener(input, "keydown", this.onOtpChange);
			super.addComponentEventListener(input, "paste", this.onOtpPaste);
		});

		super.addComponentEventListener(
			this.submitButton,
			"click",
			this.onSubmitOtp
		);
	}

	renderOtpInputs() {
		return Array.from(
			{ length: 6 },
			(_, i) => `
      <input class="otp-input form-control text-center col mx-1" type="tel" name="otp-${
			i + 1
		}" maxlength="1"
             pattern="[\\d]*" tabindex="${i + 1}" autocomplete="off">
    `
		).join("");
	}

	onOtpChange(event) {
		if (!this.isPasteShortcut(event)) {
			event.preventDefault();
		}

		const isValidInput =
			this.isNumericKey(event) || this.isBackspaceKey(event);
		if (isValidInput) {
			if (this.isBackspaceKey(event)) {
				event.target.value = "";
				this.focusPreviousField(event.target);
			} else {
				event.target.value = this.extractDigit(event);
				this.validateForm();
				this.focusNextField(event.target);
			}
		} else {
			event.target.value = "";
		}
	}

	onOtpPaste(event) {
		event.preventDefault();
		const clipboardData = event.clipboardData || window.clipboardData;
		const pastedCode = clipboardData.getData("text").replace(/\D/g, "");
		let currentInput = event.target;

		[...pastedCode].forEach((digit) => {
			if (currentInput) {
				currentInput.value = digit;
				this.validateForm();
				currentInput = this.focusNextField(currentInput);
			}
		});
	}

	validateForm() {
		const allInputsFilled = Array.from(this.otpInputs).every(
			(input) => input.value
		);
		this.submitButton.disabled = !allInputsFilled;
		if (allInputsFilled) this.onSubmitOtp();
	}

	async onSubmitOtp(event) {
		if (event) event.preventDefault();
		this.startLoading();

		const otp = Array.from(this.otpInputs)
			.map((input) => input.value)
			.join("");

		if (!otp || otp.length !== 6) {
			this.stopLoading();
			this.errorNotification.innerHTML = "Invalid OTP.";
			this.errorNotification.classList.remove("d-none");
			return;
		}

		const { success, error } = await verifyOTP({
			username: this.login,
			otp,
		});

		if (success) {
			window.redirect("/home");
		} else {
			this.stopLoading();
			this.errorNotification.innerHTML = error || "Invalid OTP.";
			this.errorNotification.classList.remove("d-none");
		}
	}

	focusPreviousField(currentInput) {
		const previousField = currentInput.previousElementSibling;
		if (previousField) {
			previousField.focus();
			return previousField;
		}
		return null;
	}

	focusNextField(currentInput) {
		const nextField = currentInput.nextElementSibling;
		if (nextField) {
			nextField.focus();
			return nextField;
		}
		return null;
	}

	startLoading() {
		this.submitButton.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span class="sr-only">Loading...</span>
    `;
		this.submitButton.disabled = true;
	}

	stopLoading() {
		this.submitButton.innerHTML = "Verify Code";
		this.submitButton.disabled = false;
	}

	backspaceKeyCode = 8;
	pasteKeyCode = 86;

	isNumericKey(event) {
		return /^\d$/.test(this.getEventKeyValue(event));
	}

	isBackspaceKey(event) {
		return this.getEventKeyCode(event) === this.backspaceKeyCode;
	}

	getEventKeyCode(event) {
		return event.keyCode || event.which;
	}

	getEventKeyValue(event) {
		return event.data || event.key;
	}

	isPasteShortcut(event) {
		const isVPressed =
			this.getEventKeyValue(event) === "v" ||
			event.keyCode === this.pasteKeyCode;
		return isVPressed && this.isControlPressed(event);
	}

	isControlPressed(event) {
		return event.ctrlKey || event.metaKey;
	}

	extractDigit(event) {
		return parseInt(this.getEventKeyValue(event));
	}
}

customElements.define("tfa-component", TwoFactorAuth);
