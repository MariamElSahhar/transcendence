import { Component } from "../../Component.js";

export class GameHeatMap extends Component {
	constructor() {
		super();
	}

	renderGameHeatMap(stats) {
		this.update();
	}

	render() {
		return `
            <div class="heatmap-container h-100 w-100 p-3 overflow-scroll d-flex justify-content-center align-items-center">
                <div class="heatmap-grid d-grid justify-content-start"></div>
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
		const contributions = [
			{ date: "2024-11-22", count: 3 },
			{ date: "2024-11-24", count: 3 },
			{ date: "2024-11-25", count: 3 },
			{ date: "2024-11-30", count: 3 },
			{ date: "2024-12-01", count: 3 },
			{ date: "2024-12-02", count: 3 },
			{ date: "2024-12-05", count: 7 },
		];
		const heatmap = this.querySelector(".heatmap-grid");

		const getLevel = (count) => {
			if (count > 10) return "level-4";
			if (count > 7) return "level-3";
			if (count > 3) return "level-2";
			if (count > 0) return "level-1";
			return "";
		};

		const container = this.querySelector(".heatmap-container");
		const containerWidth = container.offsetWidth;
		const cellsPerRow = Math.floor(containerWidth / (12 + 2)) - 5;
		const weeksToShow = cellsPerRow;

		const dates = contributions.map((c) => new Date(c.date));
		const latestDate = new Date(Math.max(...dates));

		let startDate = new Date(latestDate);
		startDate.setDate(latestDate.getDate() - weeksToShow * 7);
		while (startDate.getDay() !== 1) {
			startDate.setDate(startDate.getDate() - 1);
		}

		const currentDate = new Date(startDate);
		while (currentDate <= latestDate) {
			const dateString = currentDate.toISOString().split("T")[0];

			const contribution = contributions.find(
				(c) => c.date === dateString
			);
			const count = contribution ? contribution.count : 0;

			const cell = document.createElement("div");
			cell.className = `day ${getLevel(count)}`;
			cell.setAttribute("data-tooltip", `${dateString}: ${count} games`);

			heatmap.appendChild(cell);
			currentDate.setDate(currentDate.getDate() + 1);
		}
	}
}

customElements.define("game-heat-map", GameHeatMap);
