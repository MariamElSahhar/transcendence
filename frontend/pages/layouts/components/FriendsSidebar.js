import { Component } from "../../Component.js";
const backendURL = "http://127.0.0.1:8000";

export class FriendsSidebar extends Component {
	constructor() {
		super();
		this.friends = [];
	}

	connectedCallback() {
		super.connectedCallback();
	}

	render() {
		return `
            <div id="friends-sidebar" class="px-4 py-2">
            	<div id="friends-sidebar" class="p-3 bg-light rounded-2">
                	<h6 class="mb-4">My Friends</h6>
					<div id="friends-list" class="d-flex flex-column justify-content-start align-items-start w-100"></div>
            	</div>
            </div>
        `;
	}

	renderFriends(friends) {
		this.friends = friends;
		this.update();
	}

	postRender() {
		const friendsList = this.querySelector("#friends-list");
		friendsList.innerHTML = "";

		if (this.friends.length == 0) {
			friendsList.innerHTML = `
				<p class="text-secondary my-0">No friends yet. Try searching for users in the search bar</p>
			`;
		} else {
			this.friends.slice(0, 7).forEach((friend) => {
				const friendCard = document.createElement("div");
				friendCard.innerHTML = this.renderFriendCard(friend);
				friendsList.appendChild(friendCard);
				friendsList.classList.add("gap-1");

				super.addComponentEventListener(
					friendCard.querySelector(".user-info"),
					"click",
					() => {
						window.redirect(`/dashboard/${friend.id}`);
					}
				);
			});
		}
	}

	renderFriendCard({ username, avatar, is_online }) {
		return `
			<div role="button" class="user-info d-flex flex-row align-items-center gap-3">
				<img src=${backendURL + avatar} class="friend-avatar h-100 rounded-circle"/>
				<div>
					<p class="m-0 link-dark">${username}</p>
				</div>
			</div>
		`;
	}

	style() {
		return `
		<style>
			.friend-avatar {
				width: 30px;
				height: 30px;
			}
		</style>
		`;
	}
}

customElements.define("friends-sidebar", FriendsSidebar);
