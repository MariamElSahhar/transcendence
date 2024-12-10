import { Component } from "../../Component.js";

export class GameStatsCard extends Component {
	constructor() {
		super();
		this.stats;
		this.colors = {
			localWonColor: "cornflowerblue",
			localPlayedColor: "aliceblue",
			remoteWonColor: "indigo",
			remotePlayedColor: "lavender",
			tttWonColor: "pink",
			tttPlayedColor: "lavenderblush",
		};
	}

	renderGameStats(stats) {
		this.stats = stats;
		this.update();
	}

	postRender() {
		console.log("post render", this.stats);
		if (this.stats) this.updateGameStats();
	}

	render() {
		return (
			this.stats &&
			`
            <div class="game-stats d-flex h-100 w-100 justify-content-between align-items-center p-4">
                <div class="circle d-flex justify-content-center align-items-center">
                    <div class="stats-text d-flex flex-column justify-content-center align-items-center">
                        <h4 class="position-absolute stats-fraction d-flex flex-column">
                            <span>
                                ${this.stats.totalWon}/${this.stats.totalPlayed}
                            </span>
                            <span class="fs-5">Wins</span>
                        </h4>
                        <h4 class="position-absolute stats-percent d-flex flex-column">
                            <span>
                                ${Math.round(
									(this.stats.totalWon * 100) /
										this.stats.totalPlayed
								)}%
                            </span>
                            <span class="fs-5">Win Rate</span>
                        </h4>
                    </div>
                </div>
                <div class="breakdown d-flex flex-column">
                    <p class="d-flex align-items-baseline my-1">
                        <span>
                            <i class="bi bi-joystick"></i>
                            Local Pong
                        </span>
                        <span class="ms-auto">
                            ${this.stats.localWon}/${this.stats.localPlayed}
                        </span>
                    </p>
                    <p class="d-flex align-items-baseline my-1">
                        <span>
                        <i class="bi bi-people-fill"></i>
                        Remote Pong
                        </span>
                        <span class="ms-auto">
                            ${this.stats.remoteWon}/${this.stats.remotePlayed}
                        </span>
                    </p>
                    <p class="d-flex align-items-baseline my-1">
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
        `
		);
	}

	style() {
		return `
        <style>
            .game-stats {
                position: relative;
                width: 150px;
                height: 150px;
                flex-direction: column;
                gap: 1rem;
            }

            .circle {
                position: relative;
                width: 120px;
                height: 120px;
                border-radius: 50%;
                min-width: 120px;
                min-height: 120px;
                white-space: nowrap;
            }

            .circle::after {
                content: '';
                position: absolute;
                width: 100px;
                height: 100px;
                background: white;
                border-radius: 50%;
            }
            .breakdown {
                width: 100%
            }

            @media (min-width: 425px) {
                .circle {
                    position: relative;
                    width: 150px;
                    height: 150px;
                    min-width: 150px;
                    min-height: 150px;
                }
                .circle::after {
                    width: 120px;
                    height: 120px;
                }
                .game-stats {
                    flex-direction: row;
                    gap: 5rem;
                }
                .breakdown {
                    width: 40%
                }
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
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }

            .stats-fraction {
                opacity: 1;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }

            .circle:hover {
                .stats-percent {
                    opacity: 1;
                    visibility: visible;
                }
                .stats-fraction {
                    opacity: 0;
                    visibility: hidden;
                }
            }

            i {
                &.bi-joystick {
                    color: ${this.colors.localWonColor};
                }
                &.bi-people-fill {
                    color: ${this.colors.remoteWonColor};
                }
                &.bi-grid-3x3-gap-fill {
                    color: ${this.colors.tttWonColor};
                }
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

            ${this.colors.localWonColor} 2% ${2 + localWonPercent}%,
            ${this.colors.localPlayedColor} ${2 + localWonPercent}% ${
			2 + localPercent
		}%,

            white ${2 + localPercent}% ${4 + localPercent}%,

            ${this.colors.remoteWonColor} ${4 + localPercent}% ${
			4 + localPercent + remoteWonPercent
		}%,
            ${this.colors.remotePlayedColor} ${
			4 + localPercent + remoteWonPercent
		}% ${4 + localPercent + remotePercent}%,

            white ${4 + localPercent + remotePercent}% ${
			6 + localPercent + remotePercent
		}%,

            ${this.colors.tttWonColor} ${6 + localPercent + remotePercent}% ${
			6 + localPercent + remotePercent + tttWonPercent
		}%,
            ${this.colors.tttPlayedColor} ${
			6 + localPercent + remotePercent + tttWonPercent
		}% 100%
        )`;
	}
}

customElements.define("game-stats", GameStatsCard);
