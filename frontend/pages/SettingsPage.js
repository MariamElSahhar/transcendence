import { Component } from "./Component.js";
import {isValidSecurePassword, isValidUsername, isValidEmail} from '../scripts/utils/input-validator.js'

import {
	uploadAvatar,
	deleteAvatar,
	fetchUserById,
	updateUser,
	deleteUser,
} from "../scripts/clients/users-client.js"

import {getDefaultAvatars} from "../scripts/clients/token-client.js"
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
		this.confirmPassCheck = false;

		this.validUsername = true;
		this.validEmail = true;
		this.validPassword = true;
		this.validConfirmPassword = true;
		this.avatarDiff = false;
		this.usernameDiff = false;
		this.emailDiff = false;
		this.passwordDiff = false;
		this.avatarfile = null;
		this.vars={}
	}

	async connectedCallback() {
		const { success, data } = await getDefaultAvatars();
		this.avatars=[
			backendURL +  data.default_avatars[0]+ "/",
			backendURL +  data.default_avatars[1]+ "/",
			backendURL +  data.default_avatars[2]+ "/",
			backendURL +  data.default_avatars[3]+ "/",
			backendURL +  data.default_avatars[4]+ "/",
			backendURL +  data.default_avatars[5]+ "/",
	]
		this.render();
	}
	renderWithSettings() {
	return `
	<div id="settings" class="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
		<!-- Title -->
		<div class="form-wrapper">
		<!-- Profile Image and Form -->
			<div class="position-relative m-5" style="width: 250px; height: 300px;">
				<div id="avatar-div" class="position-relative">
				<!-- Main Profile Image -->
				<img id="avatar" src="${getUserSessionData().avatar}" alt="Unavailable"
     			class="rounded-circle m-4" style="width: 200px; height: 200px;margin-left: 2rem !important;">
				<label for="photoUpload" id="camera-icon" class="position-absolute top-50 start-50 translate-middle">
					<div class="camera-icon-circle">
						<i class="bi bi-camera"></i>
					</div>
				</label>
				<input type="file" id="photoUpload" style="display: none;" accept="image/*">
				</div>

				<!-- Avatar Options -->
				<div id="avatar-options" class="position-absolute top-50 start-50 translate-middle ">
					<img src="${this.avatars[3]}" class="rounded avatar-option position-absolute" style="top: 0px; left: -30px;">
					<img src="${this.avatars[0]}" class="rounded avatar-option position-absolute" style="top: 0px; left: 250px;">
					<img src="${this.avatars[5]}" class="rounded avatar-option position-absolute" style="top: 70px; left: -30px;">
					<img src="${this.avatars[1]}" class="rounded avatar-option position-absolute" style="top: 70px; left: 250px;">
					<img src="${this.avatars[4]}" class="rounded avatar-option position-absolute" style="top: 140px; left: -30px;">
					<img src="${this.avatars[2]}" class="rounded avatar-option position-absolute" style="top: 140px; left: 250px;">
				</div>

				<!-- Button Below the Avatar Options -->
				<div class="button-container d-flex justify-content-center mt-4">
				<button id="deleteAvatarBtn" type="button" class="btn btn-danger">
						Delete avatar <i class="bi bi-trash-fill"></i>
					</button>
				</div>
			</div>


				<!-- Form Fields -->
				<div class="ms-5">
				<div class="d-flex justify-content-between justify-content-center mb-4">
				<h2 >Settings</h2>
				<div>
					<button id="save-button" type="submit" class="btn btn-primary ms-2 p-2" disabled><i class="bi bi-floppy2-fill"></i></button>
					<button id="deletePrompt" type="button" class="btn btn-danger ms-2">Delete account</button>
				</div>
				</div>
			<form id="settings-form" class="w-100 d-flex flex-column needs-validation" novalidate>
				<!-- Email Section -->
				<div class="form-group mb-4 ">
					<div class="input-group has-validation">
						<span class=" input-group-text fw-bold text-secondary"><i class="bi bi-envelope-open-heart icon-glow" style="font-size: 2rem;"></i></span>
						<input type="email" class="textbox form-control form-control-sm" id="email"
						placeholder="New email" value="${getUserSessionData().email}"
						autocomplete="email">
						<div id="email-feedback" class="invalid-feedback"></div>
						<div class="valid-feedback"> Looks good! </div>
					</div>
				</div>
				<!-- Username Section -->
				<div class="form-group mb-4 ">
					<div class="input-group has-validation">
						<span class=" input-group-text fw-bold text-secondary">
						<i class="bi bi-coin icon-glow" style="font-size: 2rem;"></i></span>
						<input type="text" class="textbox form-control" id="username"
							placeholder="New username" value="${getUserSessionData().username}"
							autocomplete="username">
						<div id="username-feedback" class="invalid-feedback">
						</div>
						<div class="valid-feedback">
							Looks good!
						</div>
					</div>
				</div>


				<!-- Password Section -->
				<div class="form-group mb-4 ">
					<div class="input-group has-validation">
					<span class=" input-group-text fw-bold text-secondary">NEW PASSWORD</span>
						<input type="password" class="textbox form-control" id="password" placeholder="******">

						<div id="password-feedback" class="invalid-feedback">
						</div>
						<div class="valid-feedback">
							Looks good!
						</div>
					</div>
				</div>

				<!-- Confirm Password Section -->
				<div class="form-group mb-4 ">
					<div class="input-group has-validation">
					<span class=" input-group-text fw-bold text-secondary">CONFIRM PASSWORD</span>
						<input type="password" class="textbox form-control" id="confirm-password" placeholder="******">
						<div id="confirm-password-feedback" class="invalid-feedback">
							Passwords do not match.
						</div>
						<div class="valid-feedback">
							Looks good!
						</div>
					</div>
				</div>

				<!-- Two-Factor Authentication -->
				<div class="form-group mb-4 ">
					<div class="form-check form-switch d-flex align-items-center">
						<input class="form-check-input" type="checkbox" id="twofa" ${getUserSessionData().otp == 'true' ? 'checked' : ''}>
						<label class="form-check-label ms-2" for="twofa">Two-factor authentication</label>
					</div>
				</div>

				<!-- Buttons -->
			</form>
			</div>
		</div>
	</div>



	<div class="modal fade" id="confirm-delete-modal" aria-hidden="true" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5 text-danger">Confirm Account Deletion</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<form>
					<div class="modal-body d-flex flex-column justify-content-center">
						<p>Are you sure you want to delete your account? </p>
					</div>
					<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
					<button id="deleteAccount" type="button" class="btn btn-danger">Delete</button>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="modal fade" id="errorModal" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5 text-danger">Error!</h1>
				</div>
					<div class="modal-body d-flex flex-column justify-content-center">
						<p>There is an error in one of the fields!</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" id="errorClose" data-dismiss="modal">Close</button>
				</div>
			</div>
			</div>
	</div>`;
}

	style() {
		return `
      <style>
	  body {
  background-image: url("http://127.0.0.1:8000/media/images/bg.gif");
}

  .icon-glow {
  text-shadow: 0 0 8px skyblue
}

#avatar-div
{
position:relative;
z-index:10;
}

.input-group
{
max-height:4rem;
max-width:25rem;
}

.valid-feedback,
.invalid-feedback {
    position: absolute;
    top: 100%;
}


#settings {
  background-color: rgba(255, 255, 255, 0.8);
}

.textbox
{
  background-color: rgba(255,255,255,0.6);
 }


#avatar-options {
    width: 250px;
    height: 250px;
}
	    .form-wrapper {
        display: flex; /* Creates a flex container for alignment */
    }


.avatar-option {
    width: 50px;
    height: 50px;
    cursor: pointer;
    transition: transform 0.3s ease;
}
	.avatar-option:hover {
    transform: scale(1.2);
}
		  div.camera-icon-circle {
		  transition: transform 0.3s ease;
    position: absolute;
    transform: translate(-50%, -50%);
    width: 60px;  /* Size of the circle */
    height: 60px;
    background-color: rgba(255, 255, 255, 0.3); /* Grayed out background color */
    border-radius: 50%; /* Makes the circle */
    display: flex;
    justify-content: center;
    align-items: center;
}
i.bi-camera {
	transition: transform 0.3s ease, color 0.3s ease; /* Smooth scaling and color change */
	color: white;
	cursor: pointer;
	font-size: 2rem;
}
div.camera-icon-circle:hover {
    transform: translate(-50%, -50%) scale(1.5); /* Enlarges the circle */
}


div.camera-icon-circle:hover i.bi-camera {
    transform: scale(1.5); /* Scale up the icon */
}

      </style>
    `;
	}

	async render() {
		this.defaultHas2FA = getUserSessionData().otp == "true" ? true:false;
		this.initialUser=getUserSessionData().username;
		this.initialEmail=getUserSessionData().email;
		if (!(await this.loadSettings())) {
			return;
		}
		this.avatar =  this.querySelector("#avatar");
		this.photoUpload = this.querySelector("#photoUpload");
		super.addComponentEventListener(
			this.photoUpload,
			"input",
			this.#uploadAvatar
		);

		this.username = this.querySelector("#username");
		this.usernameFeedback = this.querySelector("#username-feedback");
		super.addComponentEventListener(
			this.username,
			"input",
			this.#usernameHandler
		);
		super.addComponentEventListener(
			this.querySelector("#deleteAvatarBtn"),
			"click",
			this.#deleteAvatarHandler
		);

		this.avatarOptions = this.querySelectorAll(".avatar-option"); // Select all elements
		this.avatarOptions.forEach(option => {
			super.addComponentEventListener(option, "click", this.#avatarSelector);
		});

		this.email = this.querySelector("#email");
		this.emailFeedback = this.querySelector("#email-feedback");
		super.addComponentEventListener(
			this.email,
			"input",
			this.#emailHandler
		);

		this.password = this.querySelector("#password");
		this.passwordFeeback = this.querySelector("#password-feedback");
		super.addComponentEventListener(
			this.password,
			"input",
			this.#passwordChecker
		);


		this.confirmPassword = this.querySelector("#confirm-password");

		this.confirmPasswordFeedback = this.querySelector(
			"#confirm-password-feedback"
		);
		super.addComponentEventListener(
			this.confirmPassword,
			"input",
			this.#confirmpasswordChecker
		);

		this.saveButton = this.querySelector("#save-button");
		super.addComponentEventListener(this.saveButton, "click", (event) => {
			event.preventDefault();
			this.#saveHandler();
		});
		super.addComponentEventListener(
			this.querySelector("#settings-form"),
			"submit",
			(event) => {
				event.preventDefault();
				this.#saveHandler();
			}
		);
		this.twofaBtn = this.querySelector("#twofa");
		super.addComponentEventListener(this.twofaBtn, "change", (event) => {
			this.#saveEnabler();
		});

		const deleteModal = document.getElementById('confirm-delete-modal');
		this.deleteModal = new bootstrap.Modal(deleteModal);
		const errorModal = document.getElementById('errorModal');
		this.errorModal = new bootstrap.Modal(errorModal);
		this.deleteError = document.getElementById('errorClose');
		super.addComponentEventListener(this.deleteError, "click", this.#closeError)
		this.deleteButton = this.querySelector("#deletePrompt");
		super.addComponentEventListener(
			this.deleteButton,
			"click",
			this.#deleteHandler
		);

		this.deleteAccountButton = this.querySelector("#deleteAccount");
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

	async loadSettings() {
		try {

			this.innerHTML = this.renderWithSettings() + this.style();
			return true;
		} catch (error) {
			this.#showError()
		}
		return false;
	}


	async #avatarSelector(event)
	{
		this.avatarfile=event.target.src;
		this.avatar.src=event.target.src;
		this.avatarDiff = true;
		this.#saveEnabler();
	}

	async #uploadAvatar(event) {
		let input = document.querySelector("#photoUpload");
			const file = event.target.files[0];
			console.log(event.target.files[0])
			if(file)
			{
				const reader = new FileReader();
				reader.onload = async (event) => {
					this.avatarfile = event.target.result;
					this.avatarDiff = true;
					this.avatar.src = event.target.result;
					this.#saveEnabler();
				};
				reader.readAsDataURL(file);
			} else {
				this.#showError()
				return;
			}
		};

	async #deleteAvatarHandler(event) {
		event.preventDefault();
		this.avatarDiff = true;
		this.avatar.src = 'http://127.0.0.1:8000/media//default_avatar/default_avatar.jpg';
		this.#saveEnabler();
	}
	async #changeAvatar() {
		if (this.avatarfile === null) {
			try {
				const { success, body } = await deleteAvatar(
					{user_id: getUserSessionData().userid},
				);
				if (!success) {
					this.#showError()
					return false;
				}
				return true;
			} catch (error) {
				this.#showError()
				return false;
			}
		}
		return await this.#updateAvatar();
	}

	async #updateAvatar() {
		try {
			console.log("here?", this.avatarfile,)
			const { success, body } = await uploadAvatar(
				{avatar: this.avatarfile, user_id: getUserSessionData().userid},
			);
			if (!success) {
				this.#showError()
				return false;
			}
			return true;
		} catch (error) {
			this.#showError()
			return false;
		}
	}


	async #usernameHandler() {
		clearTimeout(this.usernameTimeout);
		if (this.username.value === this.initialUser) {
			this.username.classList.remove('is-invalid', 'is-valid');
			this.usernameFeedback.innerHTML = ""
			this.usernameDiff = false;
		   this.validUsername = true;
		   this.#saveEnabler();
			return;
		}
		const { validity, message } =
			isValidUsername(this.username.value);
		if (validity) {
			this.usernameTimeout = setTimeout(() => {
				this.username.classList.remove('is-invalid');
			  this.username.classList.add('is-valid');
			this.usernameDiff = true;
			this.validUsername = true;
			this.#saveEnabler();
			}, 500);
		} else {
			this.username.classList.remove('is-valid');
			  this.username.classList.add('is-invalid');
			this.usernameFeedback.innerHTML = message;
			this.validUsername = false;
		}
		this.#saveEnabler();

	}

	#emailHandler() {
		clearTimeout(this.emailTimeout);
		if (this.email.value === this.initialEmail) {
			this.email.classList.remove('is-invalid',"is-valid")
			this.emailDiff = false;
			this.validEmail = true;
			this.#saveEnabler();
			return;
		}
		const { validity, message } = isValidEmail(
			this.email.value
		);
		if (validity) {
			this.emailTimeout = setTimeout(() => {
				this.validEmail = true;
			this.email.classList.remove('is-invalid');
			this.email.classList.add('is-valid');
			this.emailDiff = true;
			this.validEmail = true;
			this.#saveEnabler();
		}, 500);
	} else {
		this.email.classList.remove('is-valid');
		this.email.classList.add('is-invalid');
		this.emailFeedback.innerHTML = message;
		this.validEmail = false;
	}
	this.#saveEnabler();
	}

	#passwordChecker() {
		if (this.password.value === "") {
			console.log()
			this.password.classList.remove('is-invalid','is-valid');
			this.passwordFeeback.innerHTML = "";
			this.passwordDiff=false;
			this.validPassword=true;
			if(this.confirmPassword.value == "")
				{
					this.confirmPassword.classList.remove('is-invalid','is-valid');
					this.confirmPasswordFeedback.innerHTML = "";
					this.validConfirmPassword = true;
			}
			this.#saveEnabler();
			return;
		}
		const { validity, message } =
			isValidSecurePassword(this.password.value);
			if (validity) {
				this.password.classList.remove('is-invalid');
				this.password.classList.add('is-valid');
				this.validPassword = true;
				this.passwordDiff=true;
			if (this.confirmPassCheck) {
				if (this.confirmPassword.value === this.password.value) {
					this.confirmPassword.classList.remove('is-invalid');
					this.confirmPassword.classList.add('is-valid');
					this.validConfirmPassword = true;
					this.passwordDiff=true;
				} else {
					this.confirmPassword.classList.remove('is-valid');
      				this.confirmPassword.classList.add('is-invalid');
					this.confirmPasswordFeedback.innerHTML = "passwords do not match";
					this.validConfirmPassword = false;
				}
			}
			else
				this.validConfirmPassword = false;
		} else {
			this.password.classList.add('is-invalid');
			this.password.classList.remove('is-valid');
			this.passwordFeeback.innerHTML = message;
			this.validPassword = false;
			if (this.confirmPassCheck) {
				this.confirmPassword.classList.remove('is-valid');
      				this.confirmPassword.classList.add('is-invalid');
					this.confirmPasswordFeedback.innerHTML = "passwords do not match";
					this.validConfirmPassword = false;
			}
			else
			this.validConfirmPassword = false;
		}
		this.#saveEnabler();
	}

	#confirmpasswordChecker() {
		console.log("helloooo?")
		if (!this.confirmPassCheck) {
			this.confirmPassCheck = true;
		}
		this.#passwordChecker();
		if (this.confirmPassword.value === "" && this.password=="") {
			console.log("??")
			this.confirmPassword.classList.remove('is-invalid','is-valid');
				this.confirmPasswordFeedback.innerHTML = "";
				this.validConfirmPassword = true;
			return;
		}
	}


	#saveEnabler() {
		const allFieldsValid = this.validUsername && this.validEmail && this.validPassword && this.validConfirmPassword;
		const changeInField = this.avatarDiff || this.defaultHas2FA !== this.twofaBtn.checked || this.usernameDiff || this.emailDiff || this.passwordDiff;
		if ( changeInField && allFieldsValid)
		 {
			this.saveButton.disabled = false;
		} else {
			this.saveButton.disabled = true;
		}
	}

	async #updateInfo() {
		const newUsername = this.validUsername ? this.username.value : null;
		const newEmail = this.validEmail ? this.email.value : null;
		const newPassword = this.validPassword && this.validConfirmPassword ? this.password.value : null;
		if (this.usernameDiff) {
			this.vars['username'] = newUsername;
		}
		if (this.emailDiff) {
			this.vars['email'] = newEmail;
		}
		if (this.passwordDiff) {
			this.vars['password'] = newPassword;
		}
	}

	async #update2FA() {
		if (this.twofaBtn.checked) {
			this.vars["enable_otp"] = true;
		} else {
			this.vars["enable_otp"] = false;
		}
	}

	async #deleteHandler(event) {
		event.preventDefault();
		this.deleteModal.show();
	}

	async #showError(event)
	{
		this.errorModal.show();
	}

	async #closeError(event)
	{
		event.preventDefault();
		this.errorModal.hide();
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
			const { success, data } = await deleteUser(getUserSessionData().userid);
			if (success) {
				clearUserSession();
				this.deleteModal.hide();
				redirect('/');
			}
			else {
				this.#showError()
			}
			this.deleteAccountButton.innerHTML = "Delete";
			this.deleteAccountButton.disabled = false;
		} catch (error) {
			this.#showError()
		}
	}

	#startLoadButton() {
		this.saveButton.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    `;
		this.saveButton.disabled = true;
	}


	async #saveHandler() {
		this.#startLoadButton();
		if (this.avatarDiff) {
			await this.#changeAvatar();
		}
		if (this.validUsername || this.validEmail ||
			(this.validPassword && this.validConfirmPassword)) {
				this.#updateInfo();

		}
		if (this.defaultHas2FA !== this.twofaBtn.checked) {
			this.#update2FA();
		}
		if(this.defaultHas2FA !== this.twofaBtn.checked || this.usernameDiff || this.emailDiff || this.passwordDiff)
		{
			try
			{
				const { success, body ,error} = await updateUser(getUserSessionData().userid,this.vars);

				if(!success)
				{
					if (error.username) {
						this.username.classList.remove('is-valid');
						this.username.classList.add('is-invalid');

						this.usernameFeedback.innerHTML = error.username[0]; // Set the error message for username
					}
					if (error.email) {
						this.email.classList.remove('is-valid');
						this.email.classList.add('is-invalid');
						this.emailFeedback.innerHTML = error.email[0]; // Set the error message for email
					}
					this.saveButton.innerHTML = `
      <i class="bi bi-floppy2-fill"></i>
    `;
		this.saveButton.disabled = true;
					return false;
				}
			} catch (error) {
				this.#showError()
				return false;
				}
		}
		const { success, data } = await fetchUserById(
			getUserSessionData().userid
		);
		if(success)
		{
		storeUserSession({
			username: data.username,
			id: data.id,
			email: data.email,
			avatar: data.avatar,
			otp: data.enable_otp,
		});
		window.location.reload();
	}
	}
}

customElements.define("settings-page", SettingsPage);
