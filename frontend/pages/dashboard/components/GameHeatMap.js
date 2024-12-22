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
		this.update();
	}

	render() {
		return `
            <div class="h-100 w-100 p-3 flex-column d-flex justify-content-center align-items-start">
                <small class="my-0">${this.stats.totalPlayed} games played in the last year</small>
                <div class="heatmap-grid d-grid justify-content-start overflow-scroll w-100"></div>
            </div>
        `;
	}

	style() {
		return `
            <style>
                .heatmap-grid {
                    grid-template-rows: repeat(7, 12px);
                    grid-auto-flow: column;
                    gap: 2px;
                }
                .day {
                    width: 12px;
                    height: 12px;
                    background-color: #ebedf0;
                    border-radius: 2px;
                }
                .day.level-1 { background-color: #c6e48b; }
                .day.level-2 { background-color: #7bc96f; }
                .day.level-3 { background-color: #239a3b; }
                .day.level-4 { background-color: #196127; }
            </style>
        `;
	}

	postRender() {
		const heatmap = this.querySelector(".heatmap-grid");

		const getLevel = (count) => {
			if (count > 10) return "level-4";
			if (count > 7) return "level-3";
			if (count > 3) return "level-2";
			if (count > 0) return "level-1";
			return "";
		};

		const latestDate = new Date();
		const startDate = new Date(latestDate.getFullYear(), 0, 1);
		const currentDate = new Date(startDate);

		while (currentDate <= latestDate) {
			const dateString = currentDate.toISOString().split("T")[0];

			const game = this.gamecount.find((c) => c.date === dateString);
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
			const gameDate = game.date;
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
