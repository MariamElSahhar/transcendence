import { Component } from "../Component.js";
import { verifyOTP } from "../../scripts/clients/token-client.js";

export class TwoFactorAuth extends Component {
	constructor() {
		super();
	}

	render() {
		return `
        <div class="two-factor-card card m-3" id="two-factor-auth">
            <div class="card-body m-2">
                <h2 class="card-title text-center m-3">Two-Factor Authentication</h2>
                <p class="text-center">Enter the 6-digit code sent to your email</p>
                <div class="d-flex justify-content-center mb-4">
                    <i class="bi bi-shield-lock-fill display-1"></i>
                </div>
                <form>
                    <div class="d-flex form-group mb-4 w-100">
                        <input class="code-input form-control text-center col" type="tel" name="pincode-1" maxlength="1"
                                pattern="[\\d]*" tabindex="1"
                                autocomplete="off">
                        <input class="code-input form-control text-center col" type="tel" name="pincode-2" maxlength="1"
                                pattern="[\\d]*" tabindex="2"
                                autocomplete="off">
                        <input class="code-input form-control text-center col" type="tel" name="pincode-3" maxlength="1"
                                pattern="[\\d]*" tabindex="3"
                                autocomplete="off">
                        <input class="code-input form-control text-center col" type="tel" name="pincode-4" maxlength="1"
                                pattern="[\\d]*" tabindex="4"
                                autocomplete="off">
                        <input class="code-input form-control text-center col" type="tel" name="pincode-5" maxlength="1"
                                pattern="[\\d]*" tabindex="5"
                                autocomplete="off">
                        <input class="code-input form-control text-center col" type="tel" name="pincode-6" maxlength="1"
                                pattern="[\\d]*" tabindex="6"
                                autocomplete="off">
                    </div>
                    <div id="alert-form" class="d-none alert alert-danger" role="alert"></div>
                    <button id="submit-btn" type="submit" class="btn btn-primary w-100" disabled>
                      Send code
                    </button>
                </form>
            </div>
        </div>
    `;
	}

	postRender() {
		this.inputs = this.querySelectorAll("input");
		this.sendCodeBtn = this.querySelector("#submit-btn");
		this.alertForm = this.querySelector("#alert-form");

		for (const input of this.inputs) {
			super.addComponentEventListener(
				input,
				"keydown",
				this.#handleInputChange
			);
			super.addComponentEventListener(input, "paste", this.#handlePaste);
		}
		super.addComponentEventListener(
			this.sendCodeBtn,
			"click",
			this.#sendCode
		);
	}

	#renderLoader() {
		return `
      <div class="d-flex justify-content-center align-items-center" style="height: 100vh">
          <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
          </div>
      </div>
    `;
	}

	#handleInputChange(event) {
		if (!this.isPasteShortcut(event)) {
			event.preventDefault();
		}
		if (!this.isDigitKey(event) && !this.isDeleteKey(event)) {
			event.target.value = "";
			return;
		}
		if (this.isDeleteKey(event)) {
			event.target.value = "";
			this.#focusPreviousInput(event.target);
			return;
		}
		event.target.value = this.getDigitValue(event);
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
		this.#sendCode();
	}

	async #sendCode() {
		this.#startLoadButton();
		this.code = Array.from(this.inputs)
			.map((input) => input.value)
			.join("");
		const { success, error } = await verifyOTP({
			username: this.login,
			otp: this.code,
		});
		if (success) {
			window.redirect("/home");
		} else {
			this.#resetLoadButton();
			this.alertForm.innerHTML = error;
			this.alertForm.classList.remove("d-none");
		}
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

	deleteKeyCode = 8;
	vKeyCode = 86;

	isDigitKey(event) {
		return /^\d$/.test(this.getKeyValue(event));
	}

	isDeleteKey(event) {
		return this.getKeyCode(event) === this.deleteKeyCode;
	}

	getKeyCode(event) {
		return event.keyCode || event.which;
	}

	getKeyValue(event) {
		return event.data || event.key;
	}

	isPasteShortcut(event) {
		const isVPressed =
			this.getKeyValue(event) === "v" || event.keyCode === this.vKeyCode;
		return isVPressed && this.isCtrlPressed(event);
	}

	isCtrlPressed(event) {
		return event.ctrlKey || event.metaKey;
	}

	getDigitValue(event) {
		return parseInt(this.getKeyValue(event));
	}
}

customElements.define("tfa-component", TwoFactorAuth);
