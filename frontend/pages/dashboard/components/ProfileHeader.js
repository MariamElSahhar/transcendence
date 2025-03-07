import { Component } from "../../Component.js";
import {
	addFriend,
	removeFriend,
} from "../../../scripts/clients/friends-client.js";
import {
	isAuth,
	getUserSessionData,
} from "../../../scripts/utils/session-manager.js";

import { fetchUserById } from "../../../scripts/clients/users-client.js";
export class ProfileHeader extends Component {
	constructor() {
		super();
		this.user = {};
		this.data = {};
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
				this.user.avatar = window.APP_CONFIG.mediaUrl + data.avatar;
				this.user.is_friend = data.is_friend;
				this.user.is_me = mydata.userid == data.id;
				this.user.is_online = data.is_online;
			} else {
				// console.log(error);
			}
		}
	}
	async getUserFriends() {
		const { success, data } = await fetchFriends(
			getUserSessionData().userid
		);
		this.friends = success ? data : [];
	}

	renderUserData(user) {
		this.data = user;
		this.attributeChangedCallback();
	}

	checkPath() {
		if (window.location.pathname.startsWith("/dashboard/")) {
			this.user.userid = window.location.pathname
				.replace("/dashboard/", "")
				.replace(/\/+$/, "");
			if (this.user.userid == getUserSessionData().userid) this.me = true;
			else this.me = false;
		} else this.me = true;
	}

	async connectedCallback() {
		this.checkPath();
		await this.getUserData();
		this.renderUserData({
			username: this.user.username,
			avatar: this.user.avatar,
			is_me: this.user.is_me,
			is_online: this.user.is_online,
			is_friend: this.user.is_friend,
			userid: this.user.userid,
		});
		super.connectedCallback();
	}

	render() {
		if (!this.data) return "";
		return `
            <div class="bg-light rounded profile-section h-100 w-100 d-flex align-items-center justify-content-between p-2">
                <div class="d-flex align-items-center gap-2">
                    <img src="${
						this.data.avatar
					}" alt="Profile Picture" class="profile-pic">
					<div class="d-flex flex-column justify-content-center">
                    	<h4 class="mb-0">${this.data.username || "Username"}</h4>
						${
							!this.data.is_me
								? `<p class="mb-0">${
										this.data.is_online
											? "Online"
											: "Offline"
								  }</p>`
								: ""
						}
					</div>
                </div>
				${
					!this.me
						? `<button id="add-remove-friend" class="btn btn-primary btn-sm">
								${this.data.is_friend ? "Remove Friend" : "Add Friend"}
							</button>`
						: ""
				}
            </div>
        `;
	}

	postRender() {
		super.addComponentEventListener(
			this.querySelector("#add-remove-friend"),
			"click",
			async () => {
				if (!(await isAuth())) window.redirect("/");
				if (this.data.is_friend) {
					const { success } = await removeFriend(
						getUserSessionData().userid,
						this.data.userid
					);
					if (success) this.data.is_friend = false;
				} else {
					const { success } = await addFriend(
						getUserSessionData().userid,
						this.data.userid
					);
					if (success) this.data.is_friend = true;
				}
				this.attributeChangedCallback();
			}
		);
	}

	style() {
		return `
            <style>
				.profile-section {
					--bs-bg-opacity: .7;
				}

				.profile-pic {
					width: 50px;
					height: 50px;
					border-radius: 50%;
					object-fit: cover;
				}

                .profile-img-container {
                    width: 75px;
                    height: 75px;
                    min-width: 75px;
                    min-height: 75px;
                }

                .profile-info h4 {
                    margin-bottom: 0;
                    font-size: 1.25rem;
                }

                .username {
                    max-width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                @media (max-width: 650px) {
                    .profile-pic {
                        width: 60px;
                        height: 60px;
                    }

                    .profile-info h4 {
                        font-size: 1.5rem;
                    }
                }
            </style>
        `;
	}
}

customElements.define("profile-header", ProfileHeader);
