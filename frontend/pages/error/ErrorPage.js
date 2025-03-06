import { Component } from "../Component.js";

export class ErrorPage extends Component {
	async connectedCallback() {
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
	}

	render() {
		return `
		<div id="errorModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="errorModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
		  <div class="modal-content">
			<div class="modal-header">
			  <h5 class="modal-title" id="errorModalLabel">Oops! Something Went Wrong</h5>
			</div>
			<div class="modal-body">
			  <p>We're sorry, but an unexpected error has occurred.</p>
			  <p>Please refresh the page or try again later.</p>
			</div>
			<div class="modal-footer">
			  <button id="refreshBtn" class="btn btn-primary">Refresh Page</button>
			</div>
		  </div>
		</div>
	  </div>

		`;
	}

	postRender() {
		document
			.getElementById("refreshBtn")
			.addEventListener("click", () =>
				this.closeModal(window.location.pathname)
			);
	}

	closeModal(pathname) {
		const modalElement = document.getElementById("errorModal");
		const modal = bootstrap.Modal.getInstance(modalElement);
		if (modal) {
			modal.hide();
		}
		modalElement.remove();
		window.redirect(pathname);
	}
}
export async function showError() {
	const errorPage = document.createElement("error-page");
	document.body.appendChild(errorPage);
}
customElements.define("error-page", ErrorPage);
