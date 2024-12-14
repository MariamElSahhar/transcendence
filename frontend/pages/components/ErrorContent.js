import { Component } from "../Component.js";

export class ErrorContent extends Component {
	constructor() {
		super();
	}

	async connectedCallback() {
		// await import("./ErrorContent.js");
		this.render();
	}

	render() {
		const message = this.getAttribute("message");
		const refresh = this.getAttribute("refresh");
		this.innerHTML = `
      <div id="error" class="h-100 d-flex flex-column justify-content-center align-items-center rounded-3">
        <div class="icon-error">
            <i class="bi bi-exclamation-circle"></i>
        </div>
        <h1 class="text-center">Oops! Something went wrong</h1>
        <h4 class="text-center text-secondary">${message}</h4>
        ${
			refresh === "true"
				? '<button class="btn btn-primary" onclick="location.reload()">Refresh</button>'
				: ""
		}
      </div>
    `;
	}
	style() {
		return `
      <style>
        .icon-error {
            font-size: 4rem;
        }
      </style>
    `;
	}
}

customElements.define("error-content-component", ErrorContent);
