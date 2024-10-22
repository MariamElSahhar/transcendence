export class DisconnectedNavbarComponent extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <a class="navbar-brand" onclick="window.router.navigate('/')">Transcendence</a>
            <div class="d-flex">
              <button class="btn btn-outline-primary me-2" onclick="window.router.navigate('/signin')">Sign In</button>
              <button class="btn btn-outline-secondary" onclick="window.router.navigate('/signup')">Sign Up</button>
            </div>
          </div>
        </nav>
      `;
	}
}

customElements.define(
	"disconnected-navbar-component",
	DisconnectedNavbarComponent
);
