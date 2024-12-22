import { Component } from "./Component.js";
import { InputValidator } from "../scripts/utils/input-validator.js";

import {
	uploadAvatar,
	deleteAvatar,
	fetchUserById,
	updateUser,
	deleteUser,
} from "../scripts/clients/users-client.js";
import {
	storeUserSession,
	clearUserSession,
	getUserSessionData,
} from "../scripts/utils/session-manager.js";
import { redirect } from "../scripts/router.js";
const backendURL = "http://127.0.0.1:8000";

export class SettingsPage extends Component {
	constructor() {
		super();
		this.passwordHiden = true;
		this.confirmPasswordHiden = true;
		this.startConfirmPassword = false;

		this.inputValidUsername = false;
		this.inputValidEmail = false;
		this.inputValidPassword = false;
		this.inputValidConfirmPassword = false;
		this.defaultHas2FA = true;

		this.hasChangeAvatar = false;
		this.avatarfile = null;

		this.error = false;
		this.errorMessage = "";
		this.vars = {};
	}

	async connectedCallback() {
		this.render();
	}
	renderWithDefaultSettings() {
		return `
<div id="settings" class="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
    <!-- Form Section -->
    <div class="d-flex flex-column align-items-center w-100">
        <div class="w-100 text-center mb-4">
            <!-- Avatar and Title -->
			<h2 class="card-title mb-3">Settings</h2>
			<div class="d-flex flex-column align-items-center w-100">
            	<div class="position-relative mb-4">
            		<img id="avatar" src=${
						getUserSessionData().avatar
					} alt="Unavailable" class="rounded-circle object-fit-cover" style="width: 125px; height: 125px;">
            		<button id="trash-icon" type="button" class="btn btn-danger btn-sm position-absolute bottom-0 end-0">
                		<i class="bi bi-trash-fill"></i>
            		</button>
        		</div>
        	</div>

        	<form id="settings-form" class="w-100 d-flex flex-column align-items-center">
            <!-- Username Section -->
            	<div class="form-group mb-4 w-50">
                	<div class="input-group has-validation">
                    	<span class="input-group-text" id="inputGroupPrepend">@</span>
                    	<input type="text" class="form-control" id="username"
                        placeholder="New username" value=${
							getUserSessionData().username
						}
                        autocomplete="username">
                    	<div id="username-feedback" class="invalid-feedback">
                        Invalid username.
                    	</div>
                	</div>
            	</div>

            <!-- Email Section -->
            	<div class="form-group mb-4 w-50">
                	<input type="email" class="form-control form-control-sm" id="email"
                       placeholder="New email" value=${
							getUserSessionData().email
						}
                       autocomplete="email">
                	<div id="email-feedback" class="invalid-feedback">
                    Please enter a valid email.
                	</div>
            	</div>

            <!-- Password Section -->
            	<div class="form-group mb-4 w-50">
                	<div class="input-group has-validation">
                    	<input type="password" class="form-control"
                           id="password"
                           placeholder="New password">
                    	<span id="password-eye"
                          class="input-group-text dynamic-hover">
                        	<i class="bi bi-eye-fill"></i>
                    	</span>
                    	<div id="password-feedback" class="invalid-feedback">
                        Invalid password.
                    	</div>
                	</div>
            	</div>

            <!-- Confirm Password Section -->
            	<div class="form-group mb-4 w-50">
                	<div class="input-group has-validation">
                    	<input type="password" class="form-control"
                           id="confirm-password"
                           placeholder="Confirm new password">
                    	<span id="confirm-password-eye"
                          class="input-group-text dynamic-hover">
                        	<i class="bi bi-eye-fill"></i>
                    	</span>
                    	<div id="confirm-password-feedback" class="invalid-feedback">
                        Passwords do not match.
                    	</div>
                	</div>
            	</div>

            <!-- Two-Factor Authentication -->
				<div class="form-group mb-4 w-50">
    				<div class="form-check form-switch d-flex align-items-center">
        				<input class="form-check-input" type="checkbox" id="two-fa-switch" ${
							getUserSessionData().otp == "true" ? "checked" : ""
						}>
        				<label class="form-check-label ms-2" for="two-fa-switch">Two-factor authentication</label>
    				</div>
				</div>

            <!-- Alert and Buttons -->
            	<alert-component id="alert-form" alert-display="false"></alert-component>
            	<div class="d-flex justify-content-center mb-2">
                	<button id="save-button" type="submit" class="btn btn-primary ms-2" disabled>Save changes</button>
                	<button id="delete-button" type="button" class="btn btn-danger ms-2">Delete account</button>
            	</div>
        	</form>
    	</div>
	</div>
</div>
<div class="modal fade" id="confirm-delete-modal" aria-hidden="true" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5 text-danger">Confirm Account Deletion</h1>
                      <button type="button" class="btn-close"
                              data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <form>
                      <div class="modal-body d-flex flex-column justify-content-center">
                          <p>Are you sure you want to delete your account? This action cannot be undone, and all your data will
                              be anonymized.</p>
                          <alert-component id="alert-delete"
                                           alert-display="false"></alert-component>
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>

                          <button id="delete-account-btn" type="button" class="btn btn-danger">Delete</button>
                      </div>
                  </form>
              </div>
          </div>
      </div>

    `;
	}

	style() {
		return `
      <style>
      #settings {
          height: 100%;
      }

      .settings-card {
          width: 550px;
      }

      #avatar {
        transition: transform 0.3s ease;
      }

      #avatar:hover {
        transform: scale(1.1);
        cursor: pointer;
      }

      .hide-placeholder-text {
        color: var(--bs-secondary-bg);
        background-color: var(--bs-secondary-bg)!important;
		}
      </style>
    `;
	}

	async render() {
		this.defaultHas2FA = getUserSessionData().otp == "true" ? true : false;
		if (!(await this.loadDefaultSettings())) {
			return;
		}
		this.avatar = this.querySelector("#avatar");
		super.addComponentEventListener(
			this.avatar,
			"click",
			this.#avatarHandler
		);

		this.trashIcon = this.querySelector("#trash-icon");
		super.addComponentEventListener(
			this.trashIcon,
			"click",
			this.#trashAvatarHandler
		);

		this.username = this.querySelector("#username");
		this.usernameFeedback = this.querySelector("#username-feedback");
		super.addComponentEventListener(
			this.username,
			"input",
			this.#usernameHandler
		);

		this.email = this.querySelector("#email");
		this.emailFeedback = this.querySelector("#email-feedback");
		super.addComponentEventListener(
			this.email,
			"input",
			this.#emailHandler
		);

		this.password = this.querySelector("#password");
		this.passwordEyeIcon = this.querySelector("#password-eye");
		this.passwordFeeback = this.querySelector("#password-feedback");
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

		this.confirmPassword = this.querySelector("#confirm-password");
		this.confirmPasswordEyeIcon = this.querySelector(
			"#confirm-password-eye"
		);
		this.confirmPasswordFeedback = this.querySelector(
			"#confirm-password-feedback"
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

		this.alertForm = this.querySelector("#alert-form");
		this.alertDelete = this.querySelector("#alert-delete");

		this.saveButton = this.querySelector("#save-button");
		super.addComponentEventListener(this.saveButton, "click", (event) => {
			event.preventDefault();
			this.#saveHandler();
		});
		this.settingsForm = this.querySelector("#settings-form");
		super.addComponentEventListener(
			this.settingsForm,
			"submit",
			(event) => {
				event.preventDefault();
				this.#saveHandler();
			}
		);

		if (this.error) {
			this.alertForm.setAttribute("alert-message", this.errorMessage);
			this.alertForm.setAttribute("alert-type", "error");
			this.alertForm.setAttribute("alert-display", "true");
			this.error = false;
		}

		this.twoFASwitch = this.querySelector("#two-fa-switch");
		super.addComponentEventListener(this.twoFASwitch, "change", (event) => {
			this.#formHandler();
		});

		const deleteModal = document.getElementById("confirm-delete-modal");
		// this.deleteModal=deleteModal;
		this.deleteModal = new bootstrap.Modal(deleteModal);
		super.addComponentEventListener(deleteModal, "hidden.bs.modal", () => {
			this.alertDelete.setAttribute("alert-message", "");
			this.alertForm.setAttribute("alert-type", "error");
			this.alertDelete.setAttribute("alert-display", "false");
		});

		this.deleteButton = this.querySelector("#delete-button");
		super.addComponentEventListener(
			this.deleteButton,
			"click",
			this.#deleteHandler
		);

		this.deleteAccountButton = this.querySelector("#delete-account-btn");
		super.addComponentEventListener(
			this.deleteAccountButton,
			"click",
			this.#deleteAccountHandler
		);

		this.cancelButton = this.querySelector("#cancel-button");
		super.addComponentEventListener(
			this.cancelButton,
			"click",
			this.#cancelHandler
		);
	}

	async loadDefaultSettings() {
		try {
			this.innerHTML = this.renderWithDefaultSettings() + this.style();
			return true;
		} catch (error) {
			loadNetworkError().then((errorContent) => {
				this.innerHTML = errorContent;
			});
		}
		return false;
	}

	async #avatarHandler() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/jpeg, image/png";
		input.onchange = (event) => {
			const file = event.target.files[0];
			try {
				if (
					!file.type.match("image/jpeg") &&
					!file.type.match("image/png")
				) {
					this.alertForm.setAttribute(
						"alert-message",
						"Invalid file format. Please select a JPEG or PNG image."
					);
					this.alertForm.setAttribute("alert-type", "error");
					this.alertForm.setAttribute("alert-display", "true");
					return;
				}
			} catch (error) {
				this.alertForm.setAttribute(
					"alert-message",
					"Invalid file format. Please select a JPEG or PNG image."
				);
				this.alertForm.setAttribute("alert-type", "error");
				this.alertForm.setAttribute("alert-display", "true");
				return;
			}
			const reader = new FileReader();
			reader.onload = async (event) => {
				const sizeInMB = file.size / (1024 * 1024);
				if (sizeInMB > 1) {
					this.alertForm.setAttribute(
						"alert-message",
						"File too large, maximum allowed is 1Mb"
					);
					this.alertForm.setAttribute("alert-type", "error");
					this.alertForm.setAttribute("alert-display", "true");
					return;
				}
				this.avatarfile = event.target.result;
				this.hasChangeAvatar = true;
				this.#formHandler();
				this.avatar.src = event.target.result;
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}

	async #trashAvatarHandler(event) {
		event.preventDefault();
		this.hasChangeAvatar = true;
		this.avatarfile = "../../frontend/assets/image/default_avatar.jpg";
		this.avatar.src = "../../frontend/assets/image/default_avatar.jpg";
		this.#deleteAvatar();
		this.#formHandler();
	}
	async #changeAvatar() {
		if (this.avatarfile === null) {
			return await this.#deleteAvatar();
		}
		return await this.#updateAvatar();
	}

	async #deleteAvatar() {
		const { success, data, error } = await deleteAvatar({
			user_id: getUserSessionData().userid,
		});
		if (!success) {
			this.alertForm.setAttribute("alert-message", error);
			this.alertForm.setAttribute("alert-type", "error");
			this.alertForm.setAttribute("alert-display", "true");
			return false;
		}
		return true;
	}

	async #updateAvatar() {
		const { success, data, error } = await uploadAvatar({
			avatar: this.avatarfile,
			user_id: getUserSessionData().userid,
		});
		if (!success) {
			this.alertForm.setAttribute("alert-message", error);
			this.alertForm.setAttribute("alert-type", "error");
			this.alertForm.setAttribute("alert-display", "true");
			return false;
		}
		return true;
	}

	async #usernameHandler() {
		clearTimeout(this.usernameTimeout);
		if (this.username.value === this.defaultUsername) {
			this.#setUsernameInputValidity(null);
			return;
		}
		const { validity, missingRequirements } =
			InputValidator.isValidUsername(this.username.value);
		if (validity) {
			this.usernameTimeout = setTimeout(() => {
				this.#usernameExist();
			}, 500);
		} else {
			this.#setUsernameInputValidity(false, missingRequirements[0]);
		}
	}

	async #usernameExist() {
		try {
			this.#setUsernameInputValidity(true);
		} catch (error) {
			this.#setUsernameInputValidity(true);
		}
	}

	#setUsernameInputValidity(validity, message = "") {
		if (validity === null) {
			this.username.classList.remove("is-invalid");
			this.username.classList.remove("is-valid");
			this.inputValidUsername = false;
		} else if (validity) {
			this.username.classList.remove("is-invalid");
			this.username.classList.add("is-valid");
			this.inputValidUsername = true;
		} else {
			this.username.classList.remove("is-valid");
			this.username.classList.add("is-invalid");
			this.usernameFeedback.innerHTML = message;
			this.inputValidUsername = false;
		}
		this.#formHandler();
	}

	#emailHandler() {
		clearTimeout(this.emailTimeout);
		if (this.email.value === this.defaultEmail) {
			this.#setEmailInputValidity(null);
			return;
		}
		const { validity, missingRequirements } = InputValidator.isValidEmail(
			this.email.value
		);
		if (validity) {
			this.emailTimeout = setTimeout(() => {
				this.#emailExist();
			}, 500);
		} else {
			this.#setEmailInputValidity(false, missingRequirements[0]);
		}
	}

	async #emailExist() {
		try {
			this.#setEmailInputValidity(true);
		} catch (error) {
			this.#setEmailInputValidity(true);
		}
	}

	#setEmailInputValidity(validity, message = "") {
		if (validity === null) {
			this.email.classList.remove("is-invalid");
			this.email.classList.remove("is-valid");
			this.inputValidEmail = false;
		} else if (validity) {
			this.email.classList.remove("is-invalid");
			this.email.classList.add("is-valid");
			this.inputValidEmail = true;
		} else {
			this.email.classList.remove("is-valid");
			this.email.classList.add("is-invalid");
			this.emailFeedback.innerHTML = message;
			this.inputValidEmail = false;
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
			this.password.classList.remove("is-invalid");
			this.password.classList.add("is-valid");
			this.inputValidPassword = true;
		} else {
			this.password.classList.remove("is-valid");
			this.password.classList.add("is-invalid");
			this.passwordFeeback.innerHTML = message;
			this.inputValidPassword = false;
		}
		this.#formHandler();
	}

	#setInputConfirmPasswordValidity(validity, message = "") {
		if (validity) {
			this.confirmPassword.classList.remove("is-invalid");
			this.confirmPassword.classList.add("is-valid");
			this.inputValidConfirmPassword = true;
		} else {
			this.confirmPassword.classList.remove("is-valid");
			this.confirmPassword.classList.add("is-invalid");
			this.confirmPasswordFeedback.innerHTML = message;
			this.inputValidConfirmPassword = false;
		}
		this.#formHandler();
	}

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

	#toggleConfirmPasswordVisibility() {
		if (this.confirmPasswordHiden) {
			this.confirmPassword.setAttribute("type", "text");
		} else {
			this.confirmPassword.setAttribute("type", "password");
		}
		this.confirmPasswordEyeIcon.children[0].classList.toggle("bi-eye-fill");
		this.confirmPasswordEyeIcon.children[0].classList.toggle(
			"bi-eye-slash-fill"
		);
		this.confirmPasswordHiden = !this.confirmPasswordHiden;
	}

	#formHandler() {
		if (
			this.hasChangeAvatar ||
			this.inputValidUsername ||
			this.inputValidEmail ||
			this.defaultHas2FA !== this.twoFASwitch.checked ||
			(this.inputValidPassword && this.inputValidConfirmPassword)
		) {
			this.saveButton.disabled = false;
		} else {
			this.saveButton.disabled = true;
		}
	}

	async #updateInfo() {
		const newUsername = this.inputValidUsername
			? this.username.value
			: null;
		const newEmail = this.inputValidEmail ? this.email.value : null;
		const newPassword =
			this.inputValidPassword && this.inputValidConfirmPassword
				? this.password.value
				: null;
		if (newUsername) {
			this.vars["username"] = newUsername;
		}
		if (newEmail) {
			this.vars["email"] = newEmail;
		}
		if (newPassword) {
			this.vars["password"] = newPassword;
		}
	}

	async #update2FA() {
		if (this.twoFASwitch.checked) {
			this.vars["enable_otp"] = true;
		} else {
			this.vars["enable_otp"] = false;
		}
	}

	async #deleteHandler(event) {
		event.preventDefault();
		this.deleteModal.show();
	}

	async #cancelHandler(event) {
		event.preventDefault();
		this.deleteModal.hide();
	}

	async #deleteAccountHandler(event) {
		event.preventDefault();
		this.deleteAccountButton.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span class="sr-only">Delete</span>
    `;
		this.deleteAccountButton.disabled = true;
		try {
			const { success } = await deleteUser(getUserSessionData().userid);
			if (success) {
				clearUserSession();
				this.deleteModal.hide();
				redirect("/");
			} else {
				this.alertDelete.setAttribute("alert-message", body.errors[0]);
				this.alertForm.setAttribute("alert-type", "error");
				this.alertDelete.setAttribute("alert-display", "true");
			}
			this.deleteAccountButton.innerHTML = "Delete";
			this.deleteAccountButton.disabled = false;
		} catch (error) {
			window.loadNetworkError();
		}
	}

	#startLoadButton() {
		this.saveButton.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span class="sr-only">Loading...</span>
    `;
		this.saveButton.disabled = true;
	}

	#resetLoadButton() {
		this.saveButton.innerHTML = "Save changes";
		this.saveButton.disabled = false;
	}
	async #saveHandler() {
		this.#startLoadButton();
		if (this.hasChangeAvatar) {
			await this.#changeAvatar();
		}
		if (
			this.inputValidUsername ||
			this.inputValidEmail ||
			(this.inputValidPassword && this.inputValidConfirmPassword)
		) {
			this.#updateInfo();
		}
		if (this.defaultHas2FA !== this.twoFASwitch.checked) {
			this.#update2FA();
		}
		if (
			this.vars.email != undefined ||
			this.vars.username != undefined ||
			this.vars.enable_otp != undefined ||
			this.vars.password != undefined
		) {
			try {
				const { success, body } = await updateUser(
					getUserSessionData().userid,
					this.vars
				);
				if (success) {
					this.#resetLoadButton();
				}
				if (!success) {
					this.#resetLoadButton();
					if (body.username) {
						this.username.classList.remove("is-valid");
						this.username.classList.add("is-invalid");
						this.usernameFeedback.innerHTML = body.username[0]; // Set the error message for username
					}
					if (body.email) {
						this.email.classList.remove("is-valid");
						this.email.classList.add("is-invalid");
						this.emailFeedback.innerHTML = body.email[0]; // Set the error message for email
					}
					this.alertForm.setAttribute(
						"alert-message",
						body.errors[0]
					);
					this.alertForm.setAttribute("alert-type", "error");
					this.alertForm.setAttribute("alert-display", "true");
					return false;
				}
			} catch (error) {
				window.loadNetworkError();
				return false;
			}
		}
		const { success, data } = await fetchUserById(
			getUserSessionData().userid
		);
		if (success) {
			storeUserSession({
				username: data.username,
				id: data.id,
				email: data.email,
				avatar: data.avatar,
				otp: data.enable_otp,
			});
			// window.location.reload();
		}
	}
}

customElements.define("settings-page", SettingsPage);
