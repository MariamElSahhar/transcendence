// UserProfilePage.js
import { Component } from "../Component.js";
import { fetchUserGameLog } from "../../scripts/clients/gamelog-client.js";
import {
	isAuth,
	getUserSessionData,
} from "../../scripts/utils/session-manager.js";

export class DashboardPage extends Component {
	constructor() {
		super();
		this.stats = {};
		this.gamelog = {};
		this.userid = window.location.pathname.startsWith("/dashboard/")
			? window.location.pathname
					.replace("/dashboard/", "")
					.replace(/\/+$/, "")
			: getUserSessionData().userid;
	}

	async connectedCallback() {
		await import("./components/GameLogTable.js");
		await import("./components/GameStatsCard.js");
		await import("./components/GameHeatMap.js");
		await import("./components/ProfileHeader.js"),

		super.connectedCallback();

		await this.getGameLog();
		this.querySelector("gamelog-table").renderGameLog(this.gamelog);
		this.querySelector("game-stats").renderGameStats(this.stats);
		this.querySelector("game-heatmap").renderGameHeatMap(
			this.gamelog,
			this.stats
		);
	}
	// <profile-header></profile-header>

	render() {
		return `
            <div class="container d-flex flex-column gap-3 my-3">
                <div class="d-flex w-100 row-gap-5">
                    <div class="d-flex flex-column w-100 gap-3">
						<div class="graphs d-flex w-100 column-gap-2">
							<game-stats class=" w-100 flex-fill h-100 rounded"></game-stats>
							<game-heatmap class="game-heatmap flex-fill h-100 rounded"></game-heatmap>
						</div>
                        <gamelog-table class=""></gamelog-table>
                    </div>
                </div>
            </div>
        `;
	}

	// postRender()
	// {
	// 	this.querySelector("profile-header").renderUserData({
	// 		username: this.user.username,
	// 		avatar: this.user.avatar,
	// 		is_me: this.user.is_me,
	// 		is_online: this.user.is_online,
	// 		is_friend: this.user.is_friend,
	// 		userid: this.user.userid,
	// 	});
	// 	this.querySelector("friends-sidebar").renderFriends(this.friends);
	// }

	style() {
		return `
			<style>
			.profile-pic {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				object-fit: cover;
			}
			.profile-section {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				padding: 10px;
			}

			.profile-pic {
				width: 50px;
				height: 50px;
				border-radius: 50%;
				object-fit: cover;
			}

				.graphs {
					flex-direction: column;
				}
				.game-heatmap {
					width: 100%;
				}
				@media (min-width: 992px) {
					.graphs {
						flex-direction: row;
					}
					.game-heatmap {
						width: 50%;
					}
				}
			</style>
		`;
	}

	async getGameLog() {
		const { success, gamelog, stats } = await fetchUserGameLog(this.userid);
		if (!success) {
			console.error("Error fetching gamelog");
			return;
		}
		this.gamelog = gamelog;
		this.stats = stats;
	}
}

customElements.define("dashboard-page", DashboardPage);
