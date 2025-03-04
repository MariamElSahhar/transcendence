import { Component } from "../Component.js";
import { isAuth } from "../../scripts/utils/session-manager.js";

export class ErrorPage extends Component {
	async connectedCallback() {
		this.auth = await isAuth();
		this.dispatchEvent(
			new CustomEvent("connected", { bubbles: true, composed: true })
		);
		super.connectedCallback();
	}

	render() {
		return `
		<div id="errorModal" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="errorModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
		  <div class="modal-content">
			<div class="modal-header">
			  <h5 class="modal-title" id="errorModalLabel">Oops! Something Went Wrong</h5>
			</div>
			<div class="modal-body text-center">
			  <p>We're sorry, but an unexpected error has occurred.</p>
			  <p>Please try refreshing the page or go back to home.</p>
			</div>
			<div class="modal-footer">
			  <button id="refreshBtn" class="btn btn-primary" onclick="window.redirect(${window.location.pathname})">Refresh Page</button>
			  <button id="homeBtn" class="btn btn-primary" onclick="window.redirect('/home')">Home</button>
			</div>
		  </div>
		</div>
	  </div>

		`;
	}
}

export async function showError() {
	const errorPage = document.createElement("error-page");
	document.body.appendChild(errorPage);
	errorPage.addEventListener("connected", () => {
		const errorModal = document.getElementById("errorModal");

		if (errorModal) {
			const backdrop = document.createElement("div");
			backdrop.classList.add("modal-backdrop", "fade", "show");
			document.body.appendChild(backdrop);

			errorModal.classList.add("show");
			errorModal.style.display = "block";

			const modal = new bootstrap.Modal(errorModal, {
				backdrop: "static",
				keyboard: false,
			});
			modal.show();
		}
	});
}

customElements.define("error-page", ErrorPage);
