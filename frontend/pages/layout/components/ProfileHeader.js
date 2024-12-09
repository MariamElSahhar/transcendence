import { Component } from "../../Component.js";
import { getUserSessionData } from "../../../js/utils/session-manager.js";
import { addFriend, removeFriend } from "../../../js/clients/friends-client.js";

export class ProfileHeader extends Component {
	constructor() {
		super();
		this.data = {};
	}

	renderUserData(user) {
		this.data = user;
		this.update();
	}

	render() {
		return `
            <div class="d-flex justify-content-start p-4">
                <div class="profile-info d-flex align-items-center">
                    <div class="profile-img-container">
                        <img src="${this.data.avatar}"
                            onerror="this.onerror=null;this.src='/images/default_profile.svg';" alt="Profile Picture"
                            class="profile-img w-100 h-100  rounded-circle"
                        >
                    </div>
                    <div class="user-info d-flex flex-column gap-1">
                        <h3 class="username">${this.data.username}</h3>
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
					if (await removeFriend(this.data.userid))
						this.data.is_friend = false;
				} else {
					if (await addFriend(this.data.userid))
						this.data.is_friend = true;
				}
				this.update();
			}
		);
	}

	style() {
		return `
            <style>
                .profile-info {
                    gap: 10px;
                }

                .profile-img-container {
                    width: 100px;
                    height: 100px;
                    border: 4px solid ${this.data.is_online ? "green" : "grey"};
                    border-radius: 50%;
                    overflow: hidden;
                }

                .profile-img {
                    object-fit: cover;
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
