class LoginComponent extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div>
		  <h1>Login</h1>
		</div>
	  `;
	}
}

customElements.define("login-component", LoginComponent);
