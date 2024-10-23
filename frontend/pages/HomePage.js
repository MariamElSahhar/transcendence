class HomePage extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	async connectedCallback() {
		await import("./components/HomeContent.js");
		await import("./components/navbar/Navbar.js");
		this.render();
	}

	render() {
		const isAuthenticated = this.isUserAuthenticated();

		this.shadowRoot.innerHTML = isAuthenticated
			? `
          <style>
            /* Add styles here */
          </style>
          <navbar-component nav-active="home"></navbar-component>
          <friends-sidebar-component main-component="home-content"></friends-sidebar-component>
        `
			: `
          <style>
            /* Add styles here */
          </style>
          <navbar-component nav-active="home"></navbar-component>
          <home-content></home-content>
        `;
	}

	isUserAuthenticated() {
		// Placeholder for actual authentication logic
		return (
			window.userManagementClient && window.userManagementClient.isAuth()
		);
	}
}

// Define the custom element
customElements.define("home-page", HomePage);
