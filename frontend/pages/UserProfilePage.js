import { Component } from "./components/Component.js";
import { isAuth } from "../../../js/clients/token-client.js";

export class UserProfilePage extends Component {
	constructor() {
		super();
	}

	async connectedCallback() {
		//Authenticate the user
		const authenticated = await isAuth();
		if (!authenticated) {
			window.redirect("/sign-in");
			return;
		}
		await import("./components/navbar/Navbar.js");
		await import("./components/profile/UserProfileHeader.js");
		await import("./components/profile/UserProfileContent.js");
		await import("./components/profile/UserProfileChart.js");
		await import("./components/profile/UserProfileChartsCards.js");
		await import("./components/profile/UserProfileMatchList.js");
		await import("./components/profile/UserProfileStatsCard.js");
		await import("./components/profile/UserProfileStatsCards.js");
		await import("./components/layouts/FriendsSidebar.js");

		// Set the inner HTML layout
		this.innerHTML = this.render();

		// Load user data into components after rendering
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
          <user-profile-content></user-profile-content>
          <user-profile-charts-cards></user-profile-charts-cards>
          <user-profile-match-list></user-profile-match-list>
          <user-profile-stats-cards></user-profile-stats-cards>
        </div>
      </div>
    `;
	}

	async loadUserProfileData() {
		const { getToken } = await import(
			"../../../js/clients/token-client.js"
		);
		const token = true;
		if (token) {
			const { getUserProfile } = await import(
				"../../../js/clients/users-client.js"
			);
			try {
				// const userProfile = await getUserProfile(token);
				userProfile = {};

				// Pass data to components via attributes
				this.querySelector("user-profile-header").setAttribute(
					"data",
					JSON.stringify(userProfile)
				);
				this.querySelector("user-profile-content").setAttribute(
					"data",
					JSON.stringify(userProfile)
				);
				this.querySelector("user-profile-stats-cards").setAttribute(
					"data",
					JSON.stringify(userProfile)
				);
			} catch (error) {
				console.error("Failed to load profile data:", error);
			}
		} else {
			window.redirect("/sign-in");
		}
	}
}

// Register the main profile page component
customElements.define("user-profile-page", UserProfilePage);
