import { Component } from "../Component.js";
import { fetchFriends } from "../../js/clients/friends-client.js";
import { getUserSessionData } from "../../js/utils/session-manager.js";
import { fetchUserById } from "../../js/clients/users-client.js";

export class SidebarLayout extends Component {
	constructor() {
		super();
		this.slot;
		this.user = {};
		this.friends = {};
		this.me;
	}

	async connectedCallback() {
		await Promise.all([
			import("./components/ProfileHeader.js"),
			import("./components/FriendsSidebar.js"),
			import("./components/navbar/Navbar.js"),
			import("./components/Footer.js"),
		]);
		if (window.location.pathname.startsWith("/profile/")) {
			this.user.userid = window.location.pathname
				.replace("/profile/", "")
				.replace(/\/+$/, "");
			this.me = false;
		} else this.me = true;
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

		await this.getUserData();
		super.connectedCallback();
	}

	postRender() {
		this.querySelector("profile-header").renderUserData({
			username: this.user.username,
			avatar: this.user.avatar,
			is_me: this.user.is_me,
			is_online: this.user.is_online,
			is_friend: this.user.is_friend,
		});
		this.querySelector("friends-sidebar").renderFriends(this.friends);
	}

	render() {
		return `
			<div class="h-100vh d-flex flex-column">
				<layout-navbar-component></layout-navbar-component>
				<div class="d-flex h-100">
					<div class="d-flex flex-column w-25">
						<profile-header></profile-header>
						<friends-sidebar></friends-sidebar>
					</div>
					<div class="w-75 h-100" id="page-content">${this.slot}</div>
				</div>
				<footer-component class="mt-auto"></footer-component>
			</div>
        `;
	}

	async update() {
		if (window.location.pathname.startsWith("/profile/")) {
			this.user.userid = window.location.pathname
				.replace("/profile/", "")
				.replace(/\/+$/, "");
			this.me = false;
		} else this.me = true;
		await this.getUserData();
		super.update();
	}

	async renderSlot(content) {
		this.slot = content;
		if (super.isRendered()) await this.update();
	}

	async getUserData() {
		const mydata = getUserSessionData();
		if (this.me) {
			this.user.username = mydata.username;
			this.user.avatar = mydata.avatar;
			this.user.is_me = true;
			this.user.is_online = true;
			this.user.is_friend = true;
		} else {
			const { success, data, error } = await fetchUserById(
				this.user.userid
			);

			if (success) {
				this.user.username = data.username;
				this.user.avatar = data.avatar;
				this.user.is_friend = data.is_friend;
				this.user.is_me = mydata.userid == data.id;
				this.user.is_online = data.is_online;
			} else {
				console.log(error);
			}
		}
	}
}

customElements.define("sidebar-layout", SidebarLayout);
