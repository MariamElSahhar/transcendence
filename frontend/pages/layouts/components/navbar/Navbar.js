import {
	clearUserSession,
	getUserSessionData,
} from "../../../../js/utils/session-manager.js";
import { Component } from "../../../Component.js";

export class Navbar extends Component {
	constructor() {
		super();
		this.links = [
			{
				label: "Games",
				path: "/home",
			},
			{
				label: "Dashboard",
				path: "/dashboard",
			},
			{
				label: "Friends",
				path: "/friends",
			},
		];
	}

	async connectedCallback() {
		await import("./SearchNav.js");
		super.connectedCallback();
	}

	render() {
		const username = getUserSessionData().username;
		const avatar = getUserSessionData().avatar;
		return `
			<nav id="main-navbar" class="navbar navbar-expand-md bg-body-tertiary">
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
						<navbar-searchbar class="me-2"></navbar-searchbar>
						<div id="log-part" class="d-flex align-items-center">
							<div class="dropdown mx-2">
								<span class="dropdown-toggle" id="dropdownMenuLink"
										data-bs-toggle="dropdown" aria-expanded="false">
										<img id="nav-profile-img" src="${avatar}"
										alt="profile image"
										class="rounded-circle object-fit-cover w-40px h-40px">
								</span>
								<ul class="dropdown-menu dropdown-menu-end"
									aria-labelledby="dropdownMenuLink">
									<li class="dropdown-item fw-bolder" onclick="window.redirect('/dashboard')">${username}</li>
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
	}

	async #logout() {
		await clearUserSession();
		window.redirect("/");
	}
}

customElements.define("navbar-component", Navbar);
