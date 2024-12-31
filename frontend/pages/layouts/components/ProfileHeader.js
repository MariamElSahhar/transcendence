import { Component } from "../../Component.js";
import {
	addFriend,
	removeFriend,
} from "../../../scripts/clients/friends-client.js";

export class ProfileHeader extends Component {
	constructor() {
		super();
		this.data = {};
	}

	renderUserData(user) {
		this.data = user;
		this.update();
	}

	connectedCallback() {
		super.connectedCallback();
	}

	render() {
		if (!this.data) return "";
		return `
            <div class="d-flex justify-content-start p-4">
                <div class="profile-info d-flex align-items-center gap-1">
                    <div class="profile-img-container position-relative">
                        <img src="${this.data.avatar}"
                            class="profile-img w-100 h-100 rounded-circle"
                        >
						${
							this.data.is_online
								? `<span
							class="position-absolute bottom-0 end-0 p-1 border border-light rounded-circle bg-success"
							style="width: 20px; height: 20px;"></span>`
								: ""
						}
                    </div>
                    <div class="user-info d-flex flex-column gap-1">
                        <h5 class="username">${
							this.data.username || "Username"
						}</h5>
                        ${
							this.data.is_me
								? ""
								: `<button id="add-remove-friend" class="btn btn-sm btn-success">
                                    ${
										this.data.is_friend
											? "Remove Friend"
											: "Add Friend"
									}
                                </button>`
						}
                    </div>
                </div>
            </div>
        `;
	}

	postRender() {
		super.addComponentEventListener(
			this.querySelector("#add-remove-friend"),
			"click",
			async () => {
				if (this.data.is_friend) {
					const { success } = await removeFriend(this.data.userid);
					if (success) this.data.is_friend = false;
				} else {
					const { success } = await addFriend(this.data.userid);
					if (success) this.data.is_friend = true;
				}
				this.update();
			}
		);
	}

	style() {
		return `
            <style>
                .profile-img-container {
                    width: 75px;
                    height: 75px;
                    min-width: 75px;
                    min-height: 75px;
                    border-radius: 50%;
                }

                .username {
                    max-width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                @media (max-width: 650px) {
                    .username {
                        font-size: 1.25rem;
                        max-width: 150px;
                    }

                    .profile-img-container {
                        width: 80px;
                        height: 80px;
                    }
                }
            </style>
        `;
	}
}

customElements.define("profile-header", ProfileHeader);
