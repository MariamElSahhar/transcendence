import { Component } from "../Component.js";
import { getUserSessionData } from "../../js/utils/session-manager.js";
import { addFriend, removeFriend } from "../../js/clients/friends-client.js";

export class UserProfileHeader extends Component {
	constructor() {
		super();
		this.data = {};
	}

	loadUserData(user) {
		this.data = user;
		this.update();
	}

	render() {
		return `
            <div class="profile-card card mw-100">
                <div class="card-body d-flex justify-content-center">
                    <div class="profile-info d-flex align-items-center">
                        <div class="profile-img-container">
                            <img src="${
								this.data.avatar
							}" onerror="this.onerror=null;this.src='/images/default_profile.svg';" alt="Profile Picture" class="profile-img">
                        </div>
                        <div class="user-info d-flex flex-column gap-1">
                            <h1 class="username">${this.data.username}</h1>
                            ${
								this.data.is_me
									? ""
									: `<button id="add-remove-friend" class="btn btn-sm btn-success">
										${this.data.is_friend ? "Remove Friend" : "Add Friend"}
									</button>`
							}
                        </div>
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
                    width: 120px; /* Set width and height of container */
                    height: 120px;
                    border: 4px solid ${this.data.is_online ? "green" : "grey"};
                    border-radius: 50%;
                    overflow: hidden;
                    background-color: var(--bs-card-bg);
                }

                .profile-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover; /* Ensures the image covers the container fully */
                }

                .username {
                    font-size: 1.5rem;
                    font-weight: bold;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                @media (max-width: 650px) {
                    .username {
                        font-size: 1.25rem;
                        max-width: 150px;
                    }

                    .profile-img-container {
                        width: 80px; /* Adjust for smaller screens */
                        height: 80px;
                    }
                }
            </style>
        `;
	}
}

customElements.define("user-profile-header", UserProfileHeader);

// import { Component } from "../../components/Component.js";
// // import { userManagementClient } from '@utils/api';
// import { ErrorPage } from "../../utils/ErrorPage.js";
// import { FriendsCache } from "../../utils/cache/FriendsCache.js";
// // import { ToastNotifications } from '@components/notifications';

// export class UserProfileHeader extends Component {
// 	constructor() {
// 		super();
// 	}

// 	render() {
// 		return this.renderPlaceholder();
// 	}

// 	async connectedCallback() {
// 		await import("../../components/buttons/FriendsButton.js");
// 		// Check if dummy data is provided in the `data` attribute
// 		const dataAttr = this.getAttribute('data');
// 		const data = dataAttr ? JSON.parse(dataAttr) : {};

// 		// Use dummy data or fallback to defaults
// 		const username = data.username || "Guest";
// 		const profilePicture = data.profilePicture || "/images/default_profile.svg";

// 		// Render profile information with dummy or default data
// 		this.innerHTML = `
// 			<div class="profile-card card">
// 				<div class="card-body">
// 					<div class="banner">
// 						<img src="/images/user_profile_banner.jpg" alt="Profile Banner" class="banner img-fluid">
// 					</div>
// 					<div class="profile-info d-flex align-items-center">
// 						<div class="profile-img-container">
// 							<img src="/images/default_profile.svg" alt="Profile Picture" class="profile-img">
// 						</div>
// 						<div class="user-info">
// 							<h1>@${username}</h1>
// 							${this.renderProfileInteractionButtons()}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 			${this.style()}
// 		`;
// 	}

// 	style() {
// 		return (`
// 		  <style>
// 		  .banner {
// 			  width: 100%;
// 			  height: 17vh;
// 			  object-fit: cover;
// 			  position: relative;
// 		  }

// 		  .profile-info {
// 			  gap: 10px;
// 			  transform: translateY(-20%);
// 		  }

// 		  .profile-img-container {
// 			  margin-left: 50px;
// 			  border: 3px solid var(--bs-body-bg);
// 			  border-radius: 50%;
// 			  overflow: hidden;
// 			  background-color: var(--bs-card-bg);
// 		  }

// 		  .profile-img {
// 			  width: 15vw;
// 			  height: 15vw;
// 			  min-width: 85px;
// 			  min-height: 85px;
// 			  max-width: 125px;
// 			  max-height: 125px;
// 			  object-fit: cover;
// 			  border-radius: 50%;
// 		  }

// 		  @media (max-width: 650px) {
// 				.user-info {
// 				  font-size: 1rem;
// 				}
// 		  }
// 		  </style>
// 		`);
// 	  }
// 	renderProfileInteractionButtons() {
// 		return `
// 			<div class="d-flex">
// 				${this.#renderFriendButton()}
// 			</div>
// 		`;
// 	}

// 	#renderFriendButton() {
// 		const friend = FriendsCache.get(this.userId);
// 		if (!friend) {
// 			return `<button id="friend-action-btn" friend-action="send-request" class="btn btn-sm btn-success me-2">Send Friend Request</button>`;
// 		} else if (friend["status"] === "pending") {
// 			return `<button id="friend-action-btn" class="btn btn-sm btn-success me-2" disabled>Friend Request Sent</button>`;
// 		} else {
// 			return `<button id="friend-action-btn" friend-action="remove-friend" class="btn btn-sm btn-danger me-2">Remove Friend</button>`;
// 		}
// 	}
// }

// 	style() {
// 		return `
//       <style>
//       .banner {
//           width: 100%;
//           height: 17vh;
//           object-fit: cover;
//           position: relative;
//       }

//       .profile-info {
//           gap: 10px;
//           transform: translateY(-20%);
//       }

//       .profile-img-container {
//           margin-left: 50px;
//           border: 3px solid var(--bs-body-bg);
//           border-radius: 50%;
//           overflow: hidden;
//           background-color: var(--bs-card-bg);
//       }

//       .profile-img {
//           width: 15vw;
//           height: 15vw;
//           min-width: 85px;
//           min-height: 85px;
//           max-width: 125px;
//           max-height: 125px;
//           object-fit: cover;
//           border-radius: 50%;
//       }

//       @media (max-width: 650px) {
//             .user-info {
//               font-size: 1rem;
//             }
//       }
//       </style>
//     `;
// 	}

// 	renderPlaceholder() {
// 		const placeholderClass =
// 			"placeholder placeholder-lg bg-body-secondary rounded hide-placeholder-text";
// 		return `
//       <div id="header-container" class="profile-card card rounded placeholder-glow">
//         <div class="card-body p-0">
//             <div class="banner">
//                 <img src="/images/user_profile_banner.jpg" alt="Profile banner"
//                      class="banner img-fluid vh-10 rounded-top">
//             </div>
//             <div id="profile-info" class="profile-info d-flex align-items-center">
//                 <div id="picture-container" class="profile-img-container ">
//                     <img src="/images/default_profile.svg" alt="Profile picture"
//                          class="profile-img object-fit-cover mr-2 placeholder placeholder-lg">
//                 </div>
//                 <div class="user-info">
//                     <h1 class="mt-4 ${placeholderClass} col-12">_</h1>
//                     <div class="d-flex">
//                         <button class="btn btn-sm me-2 ${placeholderClass}">
//                             Send Friend Request
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//    `;
// 	}

// 	renderProfileInfo(username, profilePicture, isYourProfile = false) {
// 		return `
//       <div class="profile-img-container">
//           <img id="profile-picture" src="${profilePicture}" alt="Profile picture"
//                class="profile-img mr-2">
//       </div>
//       <div class="user-info">
//           <h1 class="mt-4">@${username}</h1>
//           ${isYourProfile ? "" : this.renderProfileInteractionButtons()}
//       </div>
//     `;
// 	}

// 	renderProfileInteractionButtons() {
// 		return `
//       <div class="d-flex">
//         ${this.#renderFriendButton()}
//       </div>
//     `;
// 	}

// 	loadUserProfile(username, userId) {
// 		this.userId = userId;
// 		this.username = username;
// 		this.headerContainer = this.querySelector("#header-container");
// 		if (this.headerContainer) {
// 			this.headerContainer.classList.remove("placeholder-glow");
// 		}
// 		this.profileInfo = this.querySelector("#profile-info");
// 		if (this.profileInfo) {
// 			this.profileInfo.innerHTML = this.renderProfileInfo(
// 				username,
// 				`${userManagementClient.getURLAvatar(username)}`,
// 				username === userManagementClient.username
// 			);
// 			this.friendActionBtn = this.querySelector("#friend-action-btn");
// 			super.addComponentEventListener(
// 				this.friendActionBtn,
// 				"click",
// 				this.#friendActionHandler
// 			);
// 			super.addComponentEventListener(
// 				document,
// 				FriendsCache.event,
// 				() => {
// 					if (this.friendActionBtn) {
// 						this.friendActionBtn.outerHTML =
// 							this.#renderFriendButton();
// 						this.friendActionBtn =
// 							this.querySelector("#friend-action-btn");
// 						super.addComponentEventListener(
// 							this.friendActionBtn,
// 							"click",
// 							this.#friendActionHandler
// 						);
// 					}
// 				}
// 			);
// 		}
// 	}

// 	#renderFriendButton() {
// 		const friend = FriendsCache.get(this.userId);
// 		if (!friend) {
// 			return `
//         <button id="friend-action-btn" friend-action="send-request" class="btn btn-sm btn-success me-2">
//             Send Friend Request
//         </button>
//       `;
// 		} else if (friend["status"] === "pending") {
// 			return `
//         <button id="friend-action-btn" class="btn btn-sm btn-success me-2" disabled>
//             Friend Request Sent
//         </button>
//       `;
// 		} else {
// 			return `
//         <button id="friend-action-btn" friend-action="remove-friend" class="btn btn-sm btn-danger me-2">
//           Remove Friend
//         </button>
//       `;
// 		}
// 	}

// 	async #friendActionHandler() {
// 		const action = this.friendActionBtn.getAttribute("friend-action");
// 		if (action === "send-request") {
// 			await this.#addFriend();
// 		} else if (action === "remove-friend") {
// 			await this.#removeFriend();
// 		}
// 	}

// 	async #addFriend() {
// 		try {
// 			const { response, body } =
// 				await userManagementClient.sendFriendRequest(this.userId);
// 			if (response.ok) {
// 				FriendsCache.set(this.userId, {
// 					id: this.userId,
// 					username: this.username,
// 					status: "pending",
// 					connected_status: "unknown",
// 				});
// 				document.querySelector("friends-component").updateFriends();
// 			} else {
// 				ToastNotifications.addErrorNotification(body["errors"][0]);
// 			}
// 		} catch {
// 			ErrorPage.loadNetworkError();
// 		}
// 	}

// 	async #removeFriend() {
// 		try {
// 			const { response, body } = await userManagementClient.removeFriend(
// 				this.userId
// 			);
// 			if (response.ok) {
// 				FriendsCache.delete(this.userId);
// 				document.querySelector("friends-component").updateFriends();
// 			} else {
// 				ToastNotifications.addErrorNotification(body["errors"][0]);
// 			}
// 		} catch {
// 			ErrorPage.loadNetworkError();
// 		}
// 	}
// }

// Register the custom element
// customElements.define("user-profile-header", UserProfileHeader);
