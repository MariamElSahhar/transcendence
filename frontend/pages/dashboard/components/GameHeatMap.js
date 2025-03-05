import { Component } from "../../Component.js";

export class GameHeatMap extends Component {
	constructor() {
		super();
		this.stats = {};
		this.gamelog = {};
		this.gamecount = [];
	}

	renderGameHeatMap(gamelog, stats) {
		this.stats = stats;
		this.gamecount = this.countGames(gamelog);
		this.attributeChangedCallback();
	}

	// <div class="heatmap bg-light p-3 flex-column d-flex justify-content-center align-items-start w-auto">
	render() {
		return `
		<div class="heatmap bg-light heatmap-container p-3 w-auto">
			<div class="p-3 flex-column d-flex justify-content-center align-items-start">
				<small class="my-0 mb-3 fw-bold">Games this year</small>
				<div class="heatmap-grid d-grid justify-content-start w-100"></div>
			</div>
			</div>

		`;
	}

	style() {
		return `
			<style>
			.heatmap-container {
				display: inline-block;
			  }

			  .heatmap {
				padding: 0;
				border: none;
				--bs-bg-opacity: .7;
			  }
				.heatmap-grid {
					grid-template-rows: repeat(7, 14px);
					grid-auto-flow: column;
					gap: 3px;
				}

				.day {
					width: 14px;
					height: 14px;
					background-color: var(--brick-200);
					border-radius: 3px;
					border: 1px solid var(--brick-700);
					transition: transform 0.2s ease-in-out;
				}

				.day:hover {
					transform: scale(1.2);
				}
				.day.level-1 { background-color: var(--brick-300); } /* Lightest */
				.day.level-2 { background-color: var(--brick-500); } /* Medium-light */
				.day.level-3 { background-color: var(--brick-600); } /* Medium-dark */
				.day.level-4 { background-color: var(--brick-700); } /* Darkest */
				.day.level-5 { background-color: var(--brick-800); } /* Darkest */

			</style>
		`;
	}

	postRender() {
		const heatmap = this.querySelector(".heatmap-grid");

		const getLevel = (count) => {
			if (count > 20) return "level-5";
			if (count > 10) return "level-4";
			if (count > 7) return "level-3";
			if (count > 3) return "level-2";
			if (count > 0) return "level-1";
			return "";
		};

		const latestDate = new Date();
		const startDate = new Date(latestDate.getFullYear(), 0, 1);
		const currentDate = new Date(startDate);

		while (
			currentDate.toISOString().split("T")[0] <=
			latestDate.toISOString().split("T")[0]
		) {
			const dateString = currentDate.toISOString().split("T")[0];
			const game = this.gamecount.find(
				(entry) => entry.date === dateString
			);
			const count = game ? game.count : 0;

			const cell = document.createElement("div");
			cell.className = `day ${getLevel(count)}`;
			cell.setAttribute("data-bs-toggle", `tooltip`);
			cell.setAttribute("data-bs-title", `${dateString}: ${count} games`);
			new bootstrap.Tooltip(cell);

			heatmap.appendChild(cell);
			currentDate.setDate(currentDate.getDate() + 1);
		}
		heatmap.scrollLeft = heatmap.scrollWidth;
	}

	countGames(gamelog) {
		const allGames = [
			...(gamelog.remote || []),
			...(gamelog.local || []),
			...(gamelog.ttt || []),
		];

		const dateCounts = allGames.reduce((counts, game) => {
			const gameDate = game.date.split("T")[0];
			if (!counts[gameDate]) {
				counts[gameDate] = 0;
			}
			counts[gameDate]++;
			return counts;
		}, {});

		const gameCount = Object.entries(dateCounts).map(([date, count]) => ({
			date,
			count,
		}));

		gameCount.sort((a, b) => new Date(a.date) - new Date(b.date));

		return gameCount;
	}
}

customElements.define("game-heatmap", GameHeatMap);
