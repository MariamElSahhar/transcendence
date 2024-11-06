import { Component } from "../Component.js";
import { isAuth } from "../../../js/utils/session-manager.js";

export class Navbar extends Component {
	authenticated = false;

	constructor() {
		super();
	}

	async connectedCallback() {
		this.authenticated = await isAuth();
		if (this.authenticated) await import("./ConnectedNavbar.js");
		else await import("./DisconnectedNavbar.js");

		// Render the Navbar based on authentication status
		this.innerHTML = this.render();
		super.connectedCallback();

		// Initialize navbar height setup after rendering
		this.#setNavbarHeight();
	}

	render() {
		const navActive = this.getAttribute("nav-active");
		if (this.authenticated) {
			return `<connected-navbar-component nav-active="${navActive}"></connected-navbar-component>`;
		} else {
			return `<disconnected-navbar-component nav-active="${navActive}"></disconnected-navbar-component>`;
		}
	}

	style() {
		return `
			<style>
				.navbar {
					position: fixed;
					top: 0;
					width: 100%;
					z-index: 9999;
					box-shadow: rgba(0, 82, 224, 0.1) 0px 6px 12px 0px;
				}

				.navbar-brand {
					font-family: 'JetBrains Mono Bold', monospace;
				}

				.nav-link {
					font-family: 'JetBrains Mono Light', monospace;
				}
			</style>
		`;
	}

	#setNavbarHeight() {
		// Check if navbar exists and get its height
		const navbar = this.querySelector(".navbar");
		if (navbar) {
			const disablePaddingTop = this.getAttribute("disable-padding-top");
			if (disablePaddingTop !== "true") {
				const navbarHeight = navbar.offsetHeight;
				document.body.style.paddingTop = navbarHeight + "px";
			} else {
				document.body.style.paddingTop = "0px";
			}
		} else {
			// Retry setting the navbar height if not yet available
			setTimeout(() => this.#setNavbarHeight(), 50);
		}
	}

	hideCollapse() {
		const navbarToggler = this.querySelector(".navbar-toggler");
		const navbarToggleDisplay = window
			.getComputedStyle(navbarToggler)
			.getPropertyValue("display");
		if (navbarToggleDisplay !== "none") {
			navbarToggler.click();
		}
	}

	get height() {
		const navbar = this.querySelector(".navbar");
		return navbar ? navbar.offsetHeight : 0; // Return 0 if navbar not yet available
	}

	addNotification(notification) {
		const notificationNav = this.querySelector(
			"notification-nav-component"
		);
		if (notificationNav) {
			notificationNav.addNotification(notification);
		}
	}
}

customElements.define("navbar-component", Navbar);

// import { Component } from "../Component.js";
// import { isAuth } from "../../../js/clients/token-client.js";

// export class Navbar extends Component {
// 	authenticated = false;

// 	constructor() {
// 		super();
// 	}

// 	render() {
// 		const navActive = this.getAttribute("nav-active");
// 		if (this.authenticated) {
// 			return `<connected-navbar-component nav-active="${navActive}"></connected-navbar-component>`;
// 		} else {
// 			return `<disconnected-navbar-component nav-active="${navActive}"></disconnected-navbar-component>`;
// 		}
// 	}

// 	async connectedCallback() {
// 		this.authenticated = await isAuth();
// 		await import("./ConnectedNavbar.js");
// 		await import("./DisconnectedNavbar.js");
// 		super.connectedCallback();
// 	}

// 	style() {
// 		return `
//       <style>
//       .navbar {
//           position: fixed;
//           top: 0;
//           width: 100%;
//           z-index: 9999;
//           box-shadow: rgba(0, 82, 224, 0.1) 0px 6px 12px 0px;
//       }

//       .navbar-brand {
//           font-family: 'JetBrains Mono Bold', monospace;
//       }

//       .nav-link {
//           font-family: 'JetBrains Mono Light', monospace;
//       }
//       </style>
//     `;
// 	}

// 	postRender() {
// 		const disablePaddingTop = this.getAttribute("disable-padding-top");
// 		if (disablePaddingTop !== "true") {
// 			const navbarHeight = this.querySelector(".navbar").offsetHeight;
// 			document.body.style.paddingTop = navbarHeight + "px";
// 		} else {
// 			document.body.style.paddingTop = "0px";
// 		}
// 	}

// 	hideCollapse() {
// 		const navbarToggler = this.querySelector(".navbar-toggler");
// 		const navbarToggleDisplay = window
// 			.getComputedStyle(navbarToggler)
// 			.getPropertyValue("display");
// 		if (navbarToggleDisplay !== "none") {
// 			navbarToggler.click();
// 		}
// 	}

// 	get height() {
// 		return this.querySelector(".navbar").offsetHeight;
// 	}

// 	addNotification(notification) {
// 		const notificationNav = this.querySelector(
// 			"notification-nav-component"
// 		);
// 		notificationNav.addNotification(notification);
// 	}
// }

// customElements.define("navbar-component", Navbar);
