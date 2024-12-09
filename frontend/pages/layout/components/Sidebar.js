import { Component } from "../../Component.js";
import { fetchFriends } from "../../../js/clients/friends-client.js";

export class Sidebar extends Component {
	constructor() {
		super();
		this.user = {};
		this.friends = {};
	}

	async connectedCallback() {
		await Promise.all([
			import("./ProfileHeader.js"),
			import("./FriendsSidebar.js"),
		]);

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
		console.log("sidebar render");
		return `
			<div class="d-flex">
				<div class="d-flex flex-column w-25">
					<profile-header></profile-header>
					<friends-sidebar></friends-sidebar>
				</div>
				<div class="w-75" id="page-content">
				</div>
			</div>
        `;
	}
}

customElements.define("sidebar-component", Sidebar);
