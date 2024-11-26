import {
	clearUserSession,
	getUserSessionData,
} from "../../js/utils/session-manager.js";
import { Component } from "../Component.js";

export class ConnectedNavbar extends Component {
	constructor() {
		super();
	}

	render() {
		const username = getUserSessionData().username;
		const avatar = getUserSessionData().avatar;
		return `
			<nav id="main-navbar" class="navbar navbar-expand-md bg-body-tertiary fixed-top">
				<div class="container-fluid">
					<a class="navbar-brand" target="window.redirect('/')">Transcendence</a>
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse"
							data-bs-target="#navbarSupportedContent"
							aria-controls="navbarSupportedContent" aria-expanded="false"
							aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarSupportedContent">
						<ul class="navbar-nav me-auto">
							<li class="nav-item">
								${this.#generateNavLink("games")}
							</li>
							<li class="nav-item">
								${this.#generateNavLink("dashboard")}
							</li>
							<li class="nav-item">
								${this.#generateNavLink("friends")}
							</li>
						</ul>
						<div class="d-flex align-items-center">
							<search-nav-component class="me-2"></search-nav-component>
						</div>
						<div id="log-part" class="d-flex align-items-center">
							<theme-button-component class="me-1"></theme-button-component>
							<friends-button-component class="me-1"></friends-button-component>
							<notification-nav-component class="me-1"></notification-nav-component>
							<div class="dropdown mx-2">
								<span class="dropdown-toggle" id="dropdownMenuLink"
										data-bs-toggle="dropdown" aria-expanded="false">
										<img id="nav-profile-img" src="${avatar}"
										alt="profile image"
										class="rounded-circle object-fit-cover w-40px h-40px">
									<span id="nav-username">@${username}</span>
								</span>
								<ul class="dropdown-menu dropdown-menu-end"
									aria-labelledby="dropdownMenuLink">
									<li><a class="dropdown-item"
											onclick="window.redirect('/settings')">Settings</a></li>
									<li><a id="logout" class="dropdown-item text-danger">Sign out</a></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</nav>
    	`;
	}

	postRender() {
		this.games = this.querySelector("#games");
		this.dashboard = this.querySelector("#dashboard");
		this.friends = this.querySelector("#friends");
		// this.ranking = this.querySelector("#ranking");

		super.addComponentEventListener(this.games, "click", this.#navigate);
		super.addComponentEventListener(this.friends,"click",this.#navigate);
		super.addComponentEventListener(this.dashboard,"click",this.#navigate);
		// super.addComponentEventListener(this.ranking, "click", this.#navigate);

		const disablePaddingTop = this.getAttribute("disable-padding-top");
		if (disablePaddingTop !== "true") {
			const navbarHeight = this.querySelector(".navbar").offsetHeight;
			document.body.style.paddingTop = navbarHeight + "px";
		} else {
			document.body.style.paddingTop = "0px";
		}
		const logout = this.querySelector("#logout");
		super.addComponentEventListener(logout, "click", this.#logout);
	}

	#navigate(event) {
		window.redirect(`/${event.target.id}/`);
	}

	async #logout() {
		await clearUserSession();
		window.redirect("/");
	}

	#generateNavLink(linkId) {
		const activeLink = this.getAttribute("nav-active");
		const navLink = document.createElement("a");
		navLink.setAttribute("id", linkId);
		navLink.classList.add("nav-link");
		if (activeLink === linkId) {
			navLink.classList.add("active");
		}
		navLink.text = linkId.charAt(0).toUpperCase() + linkId.slice(1);
		return navLink.outerHTML;
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

customElements.define("connected-navbar-component", ConnectedNavbar);
