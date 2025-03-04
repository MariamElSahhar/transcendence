import {
	clearUserSession,
	getUserSessionData,
} from "../../../scripts/utils/session-manager.js";
import { Component } from "../../../pages/Component.js";

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
				<div class="container-fluid d-flex align-items-center justify-content-between">
					<a class="navbar-brand mr-auto" role="button" onclick="window.redirect('/home')"><img class="logo" alt="Logo" src="/assets/logo.png"/></a>
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse"
							data-bs-target="#navbarSupportedContent"
							aria-controls="navbarSupportedContent" aria-expanded="false"
							aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarSupportedContent">
						<ul class="navbar-nav"></ul>
						<navbar-searchbar class="ms-auto me-2"></navbar-searchbar>
						<div id="log-part" class="d-flex align-items-center">
							<div class="dropdown mx-2">
								<span class="dropdown-toggle" id="dropdownMenuLink"
										data-bs-toggle="dropdown" aria-expanded="false">
										<img id="nav-profile-img" src="${avatar}"
										alt="profile image"
										class="rounded-circle object-fit-cover">
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

	style() {
		return `
		<style>
			#nav-profile-img {
				max-width: 40px;
				width: 40px;
				max-height: auto;
				height: auto;
			}

			.navbar {
				position: sticky;
				background-color: rgba(var(--bs-primary-rgb), 0.8) !important;
				top: 0;
				width: 100%;
				z-index: 1000;
			}

			.navbar-nav li:hover {
				color: black;
				text-shadow: 1px 1px 1px var(--mario-yellow-color);
				opacity: 1;
				transition: all 0.3s ease;
			}

			.navbar-nav .active {
				text-shadow: 1px 1px 1px var(--mario-yellow-color);
			}
		</style>
		`;
	}

	postRender() {
		const navbarList = this.querySelector(".navbar-nav");
		this.links.forEach((link) => {
			const navbarItem = document.createElement("li");
			navbarItem.classList.add("mx-2", "fw-bold");
			navbarItem.setAttribute("role", "button");
			navbarItem.textContent = link.label;
			navbarList.appendChild(navbarItem);

			if (link.path == window.location.pathname)
				navbarItem.classList.add("active");

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
