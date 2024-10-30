// UserProfilePage.js
import { Component } from "./components/Component.js";
import { dummyData } from './components/profile/dummyData.js';

export class UserProfilePage extends Component {
    constructor() {
        super();
    }

    async connectedCallback() {
        await import("./components/navbar/Navbar.js");
        await import("./components/profile/UserProfileHeader.js");
        await import("./components/profile/UserProfileChart.js");
        await import("./components/profile/UserProfileChartsCards.js");
        await import("./components/profile/UserProfileMatchList.js");
        // await import("./components/profile/UserProfileStatsCard.js");
        // await import("./components/profile/UserProfileStatsCards.js");
        await import("./components/layouts/FriendsSidebar.js");

        // Render the HTML structure and load data into components
        this.innerHTML = this.render();
        this.loadUserProfileData();
    }

    render() {
        return `
            <navbar-component></navbar-component>
            <div class="profile-page">
                <user-profile-header></user-profile-header>
                <div class="profile-content">
                    <friends-sidebar-component
                        main-component="user-profile-content-component"
                        username="${this.getAttribute("username")}">
                    </friends-sidebar-component>
                    <user-profile-stats-cards></user-profile-stats-cards>
                    <user-profile-charts-cards></user-profile-charts-cards>
                    <user-profile-match-list></user-profile-match-list>
                </div>
            </div>
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
			const statsData = dummyData.stats || { elo: 0, winRate: 0, matchesPlayed: 0, friends: 0 };
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
