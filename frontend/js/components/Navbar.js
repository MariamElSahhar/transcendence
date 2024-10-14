class NavbarComponent extends HTMLElement {
	async connectedCallback() {
		this.innerHTML = `
			<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
				<div class="container-fluid">
					<div class="d-flex justify-content-start">
						<img
							src="../images/logo.svg"
							class="icon-option me-2"
							alt="Pong Game Logo"
						/>
					</div>
				</div>
			</nav>`;
	}
}

customElements.define("navbar-component", NavbarComponent);
