import {
	clearUserSession,
	getUserSessionData,
} from "../../js/utils/session-manager.js";
import { Component } from "../Component.js";

export class Navbar extends Component {
	constructor() {
		super();
		this.links = [
			{
				label: "Games",
				path: "/games",
			},
			{
				label: "Dashboard",
				path: "/profile",
			},
			{
				label: "Friends",
				path: "/friends",
			},
		];
	}

	render() {
		const username = getUserSessionData().username;
		const avatar = getUserSessionData().avatar;
		return `
			<nav id="main-navbar" class="navbar navbar-expand-md bg-body-tertiary fixed-top">
				<div class="container-fluid">
					<a class="navbar-brand" onclick="window.redirect('/home')">Transcendence</a>
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse"
							data-bs-target="#navbarSupportedContent"
							aria-controls="navbarSupportedContent" aria-expanded="false"
							aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarSupportedContent">
						<ul class="navbar-nav me-auto"></ul>
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
								</span>
								<ul class="dropdown-menu dropdown-menu-end"
									aria-labelledby="dropdownMenuLink">
									<li class="dropdown-item"><strong>${username}</strong></li>
									<li id="settings" class="dropdown-item" onclick="window.redirect('/settings')">Settings</li>
									<li id="logout" class="dropdown-item text-danger">Sign out</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</nav>
    	`;
	}

	postRender() {
		const navbarList = this.querySelector(".navbar-nav");
		this.links.forEach((link) => {
			const navbarItem = document.createElement("li");
			navbarItem.classList.add("mx-2");
			navbarItem.setAttribute("role", "button");
			navbarItem.textContent = link.label;
			navbarList.appendChild(navbarItem);

			super.addComponentEventListener(navbarItem, "click", () => {
				window.redirect(link.path);
			});
		});
		super.addComponentEventListener(
			this.querySelector("#logout"),
			"click",
			this.#logout
		);

		const disablePaddingTop = this.getAttribute("disable-padding-top");
		if (disablePaddingTop !== "true") {
			const navbarHeight = this.querySelector(".navbar").offsetHeight;
			document.body.style.paddingTop = navbarHeight + "px";
		} else {
			document.body.style.paddingTop = "0px";
		}
	}

	async #logout() {
		await clearUserSession();
		window.redirect("/");
	}
}

customElements.define("navbar-component", Navbar);
