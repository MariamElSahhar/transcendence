// UserProfilePage.js
import { Component } from "../Component.js";
import { fetchUserById } from "../../js/clients/users-client.js";
import { dummyData } from "./dummyData.js";
import { getUserSessionData } from "../../js/utils/session-manager.js";

export class UserProfilePage extends Component {
	constructor() {
		super();
		this.user = {};
		this.stats = {};
		this.gamelog = {};
		if (window.location.pathname.startsWith("/profile/")) {
			this.user.userid = window.location.pathname
				.replace("/profile/", "")
				.replace(/\/+$/, "");
		} else this.me = true;
	}

	async connectedCallback() {
		await import("../navbar/Navbar.js");
		await import("./UserProfileHeader.js");
		await import("../buttons/FriendsButton.js");
		await import("./GameLogTable.js");
		await import("./GameStatsCard.js");

		await import("./UserProfileChart.js");
		await import("./UserProfileChartsCards.js");

		super.connectedCallback();
		await this.getUserData();
		await this.getGameLog();
		this.querySelector("user-profile-header").renderUserData(this.user);
		this.querySelector("gamelog-table").renderGameLog(this.gamelog);
		this.querySelector("game-stats").renderGameStats(this.stats);
		// this.loadChartsData();
	}

	render() {
		return `
            <navbar-component></navbar-component>
            <div class="profile-page container">
                <user-profile-header></user-profile-header>
                <div class="profile-content d-flex">
                    <div class="profile-main-content">
						<game-stats></game-stats>
						<game-heat-map></game-heat-map>
                        <gamelog-table></gamelog-table>
                    </div>
                </div>
            </div>
        `;
	}

	style() {
		return `
            <style>
                .container {
                    max-width: 1200px;
                    margin: auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    color: #333;
                }

                /* Profile Page Layout */
                .profile-page {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .profile-content {
                    display: flex;
                    gap: 20px;
                    margin-top: 20px;
                }

                /* Sidebar styling
                friends-sidebar {
                    flex: 1;
                    min-width: 250px;
                    max-width: 300px;
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }  */

                /* Main content styling */
                .profile-main-content {
                    flex: 3;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                /* Stats Cards styling */
                user-profile-stats-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                }

                /* Card styling */
                user-profile-stats-card-component,
                user-profile-charts-cards,
                user-profile-match-list {
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    background-color: #fff;
                    padding: 20px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                /* Card hover effect */
                user-profile-stats-card-component:hover,
                user-profile-charts-cards:hover,
                user-profile-match-list:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                }

                /* Match List specific styling */
                user-profile-match-list {
                    margin-top: 20px;
                }

                /* Styling for titles */
                h5 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #495057;
                }
            </style>
        `;
	}

	loadChartsData() {
		const chartsComponent = this.querySelector("user-profile-charts-cards");
		if (chartsComponent) {
			const eloGraph = dummyData.charts?.eloGraph || { graph: [] };
			const winRateGraph = dummyData.charts?.winRateGraph || {
				graph: [],
			};
			const matchesPlayedGraph = dummyData.charts?.matchesPlayedGraph || {
				graph: [],
			};
			chartsComponent.loadStatistics(
				eloGraph,
				winRateGraph,
				matchesPlayedGraph
			);
		} else {
			console.error("UserProfileChartsCards component not found.");
		}
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

	async getGameLog() {
		// const { success, data, error } = await getUserGameLog(this.user.userid);
		// if (success) {
		// 	this.log.local = data;
		// }
		this.gamelog = {
			local: [
				{
					date: "20/11/2024",
					opponent: "Player 2",
					my_score: "3",
					opponent_score: "2",
					result: "Win",
				},
			],
			remote: [],
			ttt: [],
		};

		// DUMMY DATA
		const localPlayed = 20;
		const localWon = 10;
		const remotePlayed = 10;
		const remoteWon = 5;
		const tttPlayed = 10;
		const tttWon = 5;
		const totalPlayed = localPlayed + remotePlayed + tttPlayed;
		const totalPlayedGames = localPlayed + tttPlayed + remotePlayed;
		const totalWonGames = localWon + tttWon + remoteWon;
		this.stats = {
			localPlayed,
			localWon,
			remotePlayed,
			remoteWon,
			tttPlayed,
			tttWon,
			totalPlayed,
			totalPlayedGames,
			totalWonGames,
		};
	}
}

customElements.define("user-profile-page", UserProfilePage);

// import { Component } from "./components/Component.js";
// import { isAuth } from "../../../js/clients/token-client.js";

// export class UserProfilePage extends Component {
// 	constructor() {
// 		super();
// 	}

// 	async connectedCallback() {
// 		//Authenticate the user
// 		const authenticated = await isAuth();
// 		if (!authenticated) {
// 			window.redirect("/sign-in");
// 			return;
// 		}
// 		await import("./components/navbar/Navbar.js");
// 		await import("./components/profile/UserProfileHeader.js");
// 		await import("./components/profile/UserProfileContent.js");
// 		await import("./components/profile/UserProfileChart.js");
// 		await import("./components/profile/UserProfileChartsCards.js");
// 		await import("./components/profile/UserProfileMatchList.js");
// 		await import("./components/profile/UserProfileStatsCard.js");
// 		await import("./components/profile/UserProfileStatsCards.js");
// 		await import("./components/layouts/FriendsSidebar.js");

// 		// Set the inner HTML layout
// 		this.innerHTML = this.render();

// 		// Load user data into components after rendering
// 		this.loadUserProfileData();
// 	}

// 	render() {
// 		return `
//       <navbar-component></navbar-component>
//       <div class="profile-page">
//         <user-profile-header></user-profile-header>
//         <div class="profile-content">
//           <friends-sidebar-component
//             main-component="user-profile-content-component"
//             username="${this.getAttribute("username")}">
//           </friends-sidebar-component>
//           <user-profile-content></user-profile-content>
//           <user-profile-charts-cards></user-profile-charts-cards>
//           <user-profile-match-list></user-profile-match-list>
//           <user-profile-stats-cards></user-profile-stats-cards>
//         </div>
//       </div>
//     `;
// 	}

// 	async loadUserProfileData() {
// 		const { getToken } = await import(
// 			"../../../js/clients/token-client.js"
// 		);
// 		const token = true;
// 		if (token) {
// 			const { getUserProfile } = await import(
// 				"../../../js/clients/users-client.js"
// 			);
// 			try {
// 				// const userProfile = await getUserProfile(token);
// 				userProfile = {};

// 				// Pass data to components via attributes
// 				this.querySelector("user-profile-header").setAttribute(
// 					"data",
// 					JSON.stringify(userProfile)
// 				);
// 				this.querySelector("user-profile-content").setAttribute(
// 					"data",
// 					JSON.stringify(userProfile)
// 				);
// 				this.querySelector("user-profile-stats-cards").setAttribute(
// 					"data",
// 					JSON.stringify(userProfile)
// 				);
// 			} catch (error) {
// 				console.error("Failed to load profile data:", error);
// 			}
// 		} else {
// 			window.redirect("/sign-in");
// 		}
// 	}
// }

// // Register the main profile page component
// customElements.define("user-profile-page", UserProfilePage);
