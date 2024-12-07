import { Component } from "../../Component.js";

export class GameStatsCard extends Component {
	constructor() {
		super();
		this.stats = {};
	}

	renderGameStats(stats) {
		this.stats = stats;
		this.update();
	}

	postRender() {
		this.updateGameStats();
	}

	render() {
		return `
            <div class="game-stats d-flex flex-row h-100 w-100 gap-5 justify-content-start align-items-center p-3">
                <div class="circle d-flex justify-content-center align-items-center">
                    <div class="stats-text d-flex flex-column justify-content-center align-items-center">
                        <span class="stats-fraction position-absolute">
                            ${this.stats.totalWon}/${this.stats.totalPlayed}
                        </span>
                         <span class="stats-percent position-absolute">
                            ${Math.round(
								(this.stats.totalWon * 100) /
									this.stats.totalPlayed
							)}%
                        </span>
                    </div>
                </div>
                <div class="d-flex flex-column w-40">
                    <p class="d-flex align-items-baseline">
                        <span>
                            <i class="bi bi-joystick"></i>
                            Local Pong
                        </span>
                        <span class="ms-auto">
                            ${this.stats.localWon}/${this.stats.localPlayed}
                        </span>
                    </p>
                    <p class="d-flex align-items-baseline">
                        <span>
                        <i class="bi bi-people-fill"></i>
                        Remote Pong
                        </span>
                        <span class="ms-auto">
                            ${this.stats.remoteWon}/${this.stats.remotePlayed}
                        </span>
                    </p>
                    <p class="d-flex align-items-baseline">
                        <span>
                            <i class="bi bi-grid-3x3-gap-fill"></i>
                            Tic Tac Toe
                        </span>
                        <span class="ms-auto">
                            ${this.stats.tttWon}/${this.stats.tttPlayed}
                        </span>
                    </p>
                </div>
            </div>
        `;
	}

	style() {
		return `
        <style>
            .game-stats {
                position: relative;
                width: 150px;
                height: 150px;
            }

            .circle {
                position: relative;
                width: 150px;
                height: 150px;
                border-radius: 50%;
                min-width: 150px;
                min-height: 150px;
            }

            .circle::after {
                content: '';
                position: absolute;
                width: 120px;
                height: 120px;
                background: white;
                border-radius: 50%;
            }

            .stats-text {
                position: absolute;
                font-size: 1.25rem;
                font-weight: bold;
                text-align: center;
                z-index: 1;
            }

            .stats-percent {
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            }

            .stats-fraction {
                opacity: 1;
                transition: opacity 0.3s ease-in-out;
            }

            .circle:hover .stats-percent {
                opacity: 1;
            }

            .circle:hover .stats-fraction {
                opacity: 0;
            }
        </style>`;
	}

	updateGameStats() {
		const adjustedTotal = 100 - 6;

		const localPercent =
			(this.stats.localPlayed / this.stats.totalPlayed) * adjustedTotal;
		const localWonPercent =
			(this.stats.localWon / this.stats.totalPlayed) * adjustedTotal;
		const remotePercent =
			(this.stats.remotePlayed / this.stats.totalPlayed) * adjustedTotal;
		const remoteWonPercent =
			(this.stats.remoteWon / this.stats.totalPlayed) * adjustedTotal;
		const tttPercent =
			(this.stats.tttPlayed / this.stats.totalPlayed) * adjustedTotal;
		const tttWonPercent =
			(this.stats.tttWon / this.stats.totalPlayed) * adjustedTotal;

		const circle = document.querySelector(".circle");
		circle.style.background = `conic-gradient(
            white 0% 2%,

            cornflowerblue 2% ${2 + localWonPercent}%,
            aliceblue ${2 + localWonPercent}% ${2 + localPercent}%,

            white ${2 + localPercent}% ${4 + localPercent}%,

            indigo ${4 + localPercent}% ${4 + localPercent + remoteWonPercent}%,
            lavender ${4 + localPercent + remoteWonPercent}% ${
			4 + localPercent + remotePercent
		}%,

            white ${4 + localPercent + remotePercent}% ${
			6 + localPercent + remotePercent
		}%,

            pink ${6 + localPercent + remotePercent}% ${
			6 + localPercent + remotePercent + tttWonPercent
		}%,
            lavenderblush ${
				6 + localPercent + remotePercent + tttWonPercent
			}% 100%
        )`;
	}
}

customElements.define("game-stats", GameStatsCard);
