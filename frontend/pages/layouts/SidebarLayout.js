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
		this.checkPath();
		await this.getUserFriends();
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
			userid: this.user.userid,
		});
		this.querySelector("friends-sidebar").renderFriends(this.friends);
	}

	render() {
		return `
			<div class="min-vh-100 d-flex flex-column">
				<navbar-component></navbar-component>
				<div class="d-flex h-100">
					<div class="d-flex flex-column w-25">
						<profile-header></profile-header>
						<friends-sidebar></friends-sidebar>
					</div>
					<div class="w-75 flex-grow-1" id="page-content">${this.slot}</div>
				</div>
				<footer-component class="mt-auto"></footer-component>
			</div>
        `;
	}

	async update() {
		this.checkPath();
		await this.getUserData();
		await this.getUserFriends();
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

	async getUserFriends() {
		const { success, data } = await fetchFriends();
		this.friends = success ? data : [];
	}

	checkPath() {
		if (window.location.pathname.startsWith("/dashboard/")) {
			this.user.userid = window.location.pathname
				.replace("/dashboard/", "")
				.replace(/\/+$/, "");
			this.me = false;
		} else this.me = true;
	}
}

customElements.define("sidebar-layout", SidebarLayout);
