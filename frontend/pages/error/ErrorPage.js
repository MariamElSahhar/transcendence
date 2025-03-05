import { Component } from "../Component.js";
import { isAuth } from "../../scripts/utils/session-manager.js";

export class ErrorPage extends Component {
	async connectedCallback() {
		this.auth = await isAuth();
		super.connectedCallback();
		this.dispatchEvent(
			new CustomEvent("connected", { bubbles: true, composed: true })
		);
		const errorModal = document.getElementById("errorModal");
		if (errorModal) {
			const modal = new bootstrap.Modal(errorModal, {
				backdrop: "static",
				keyboard: false,
			});
			modal.show();
		}
		document.getElementById("refreshBtn").addEventListener("click", () => this.closeModal(window.location.pathname));
		document.getElementById("homeBtn").addEventListener("click", () => this.closeModal("/home"));
	}

	render() {
		return `
		<div id="errorModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="errorModalLabel" aria-hidden="true">
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
			  <button id="refreshBtn" class="btn btn-primary">Refresh Page</button>
			  <button id="homeBtn" class="btn btn-primary" onclick="window.redirect('/home')">Home</button>
			</div>
		  </div>
		</div>
	  </div>

		`;
	}
	closeModal(pathname)
	{
		const modalElement = document.getElementById("errorModal");
		const modal = bootstrap.Modal.getInstance(modalElement);
		if (modal) {
			modal.hide();
		}
		modalElement.remove();
		window.redirect(pathname );
	}
}
export async function showError() {
	const errorPage = document.createElement("error-page");
	document.body.appendChild(errorPage);

}
customElements.define("error-page", ErrorPage);
