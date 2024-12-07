import { Component } from "../../Component.js";

export class GameHeatMap extends Component {
	constructor() {
		super();
	}

	renderGameHeatMap(stats) {
		this.update();
	}

	postRender() {
		const frequencyData = [0, 1, 3, 5, 7, 9];
		const maxFrequency = Math.max(...frequencyData);

		const heatmapContainer = document.querySelector(".heatmap-grid");

		frequencyData.forEach((frequency) => {
			const cell = document.createElement("div");
			cell.classList.add("heatmap-cell");

			const intensity = (frequency / maxFrequency) * 100;

			const color = `rgb(255, ${255 - intensity}, ${255 - intensity})`;
			cell.style.backgroundColor = color;
			heatmapContainer.appendChild(cell);
		});
	}

	render() {
		return `
            <div class="heatmap-container">
                <div class="heatmap-grid"></div>
            </div>
        `;
	}

	style() {
		return `
        <style>
            .heatmap-container {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                }

            .heatmap-grid {
                display: grid;
                grid-template-rows: repeat(7, 20px);
                grid-gap: 5px;
                margin: 0;
            }

            .heatmap-cell {
                width: 20px;
                height: 20px;
                border-radius: 3px;
                background-color: #e0e0e0; /* Default light color for no activity */
                transition: background-color 0.3s ease;
                    }

            .heatmap-cell:hover {
                opacity: 0.7;
            }
        </style>
        `;
	}
}

customElements.define("game-heat-map", GameHeatMap);
