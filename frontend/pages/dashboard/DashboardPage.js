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

	render() {
		return `
		<div class="container d-flex flex-column gap-3 my-3">
		<profile-header></profile-header>
		<div class="d-flex w-100 row-gap-5">
				<div class="d-flex flex-column w-100 gap-3">
				 	<div class="graphs d-flex w-100 column-gap-2 row-gap-2">
						<game-stats class="w-100 flex-fill h-100 rounded"></game-stats>
						<game-heatmap class="game-heatmap flex-fill h-100 rounded"></game-heatmap>
					</div>
					<gamelog-table></gamelog-table>
				</div>
			</div>
		</div>
        `;
	}


	style() {
		return `
			<style>
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
