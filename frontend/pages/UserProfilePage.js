// UserProfilePage.js
import { Component } from "./components/Component.js";
import { dummyData } from './components/profile/dummyData.js';

export class UserProfilePage extends Component {
    constructor() {
        super();
    }

    async connectedCallback() {
        await import("./components/navbar/Navbar.js");
        await import("./components/buttons/FriendsButton.js");
        await import("./components/profile/UserProfileHeader.js");
        await import("./components/profile/UserProfileChart.js");
        await import("./components/profile/UserProfileChartsCards.js");
        await import("./components/profile/UserProfileMatchList.js");
        await import("./components/profile/UserProfileStatsCard.js");
        await import("./components/profile/UserProfileStatsCards.js");
        await import("./components/layouts/FriendsSidebar.js");

        // Render the HTML structure and load data into components
        this.innerHTML = this.render() + this.style();
        this.loadUserProfileData();
    }

    render() {
        return `
            <navbar-component></navbar-component>
            <div class="profile-page container">
                <user-profile-header></user-profile-header>
                <div class="profile-content d-flex">
                    <friends-sidebar-component
                        main-component="user-profile-content-component"
                        username="${this.getAttribute("username")}">
                    </friends-sidebar-component>
                    <div class="profile-main-content">
                        <user-profile-stats-cards></user-profile-stats-cards>
                        <user-profile-charts-cards></user-profile-charts-cards>
                        <user-profile-match-list></user-profile-match-list>
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

                /* Sidebar styling */
                friends-sidebar-component {
                    flex: 1;
                    min-width: 250px;
                    max-width: 300px;
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

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

                /* Header styling */
                user-profile-header {
                    background-color: #6c757d;
                    color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
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

                /* Button and link styles */
                .btn, a {
                    color: #007bff;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                .btn:hover, a:hover {
                    color: #0056b3;
                }
            </style>
        `;
    }

    loadUserProfileData() {
        // Load data for each component by setting attributes or calling methods
        this.loadHeaderData();
        this.loadStatsCardsData();
        this.loadMatchListData();
        this.loadChartsData();
    }

    loadHeaderData() {
        const userProfileHeader = this.querySelector('user-profile-header');
        if (userProfileHeader) {
            const headerData = dummyData.userProfile || { username: "Guest", profilePicture: "/images/default_profile.svg" };
            userProfileHeader.setAttribute('data', JSON.stringify(headerData));
        } else {
            console.error("UserProfileHeader component not found.");
        }
    }
    
    loadStatsCardsData() {
        const statsCards = this.querySelector('user-profile-stats-cards');
        if (statsCards) {
          const statsData = dummyData.stats;
          statsCards.setAttribute('data', JSON.stringify(statsData));
        } else {
          console.error("UserProfileStatsCards component not found.");
        }
      }

    loadMatchListData() {
        const matchList = this.querySelector('user-profile-match-list');
        if (matchList) {
            const matchHistory = dummyData.matchHistory || [];
            matchList.loadMatchHistory(dummyData.userProfile.username, matchHistory);
        } else {
            console.error("UserProfileMatchList component not found.");
        }
    }

    loadChartsData() {
        const chartsComponent = this.querySelector('user-profile-charts-cards');
        if (chartsComponent) {
            const eloGraph = dummyData.charts?.eloGraph || { graph: [] };
            const winRateGraph = dummyData.charts?.winRateGraph || { graph: [] };
            const matchesPlayedGraph = dummyData.charts?.matchesPlayedGraph || { graph: [] };
            chartsComponent.loadStatistics(eloGraph, winRateGraph, matchesPlayedGraph);
        } else {
            console.error("UserProfileChartsCards component not found.");
        }
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
