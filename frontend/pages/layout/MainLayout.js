import { Component } from "../Component.js";
import { getUserSessionData } from "../../js/utils/session-manager.js";
import { fetchFriends } from "../../js/clients/friends-client.js";

export class MainLayout extends Component {
	constructor() {
		super();
		this.user = {};
		this.friends = {};
	}

	async connectedCallback() {
		await import("./components/navbar/Navbar.js");
		await import("./components/ProfileHeader.js");
		await import("./components/FriendsSidebar.js");

		this.user = getUserSessionData();
		// this.friends = fetchFriends();
		this.friends = [
			{
				id: 33,
				username: "mariam",
				avatar: "http://127.0.0.1:8000/media/images/default.jpg",
				is_online: true,
				last_seen: "2024-11-12T22:13:17.193941Z",
			},
			{
				id: 33,
				username: "mariam",
				avatar: "http://127.0.0.1:8000/media/images/default.jpg",
				is_online: true,
				last_seen: "2024-11-12T22:13:17.193941Z",
			},
			{
				id: 33,
				username: "mariam",
				avatar: "http://127.0.0.1:8000/media/images/default.jpg",
				is_online: true,
				last_seen: "2024-11-12T22:13:17.193941Z",
			},
		];
		super.connectedCallback();

		this.querySelector("profile-header").renderUserData({
			username: this.user.username,
			avatar: this.user.avatar,
			is_me: true,
			is_online: true,
			is_friend: true,
		});
		this.querySelector("friends-sidebar").renderFriends(this.friends);
	}

	render() {
		return `
            <layout-navbar-component></layout-navbar-component>
			<div class="d-flex flex-row">
				<div class="d-flex flex-column w-25">
					<profile-header></profile-header>
					<friends-sidebar></friends-sidebar>
				</div>
				<div class="w-75">
					<h1>page content</h1>
				</div>
			</div>
        `;
	}

	style() {
		return `
			<style>

			</style>
		`;
	}
}

customElements.define("main-layout", MainLayout);
