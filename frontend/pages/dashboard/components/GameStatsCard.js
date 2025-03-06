import { Component } from "../../Component.js";

export class GameStatsCard extends Component {
	constructor() {
		super();
		this.stats = {};
		this.colors = {
			localWonColor: "var(--mario-blue-color)",
			localPlayedColor: "var(--sky-100)",
			remoteWonColor: "var(--mario-pink-color)",
			remotePlayedColor: "var(--sky-100)",
			tttWonColor: "var(--mario-yellow-color)",
			tttPlayedColor: "var(--sky-100)",
			gapColor: "var(--sky-200)",
		};
	}

	renderGameStats(stats) {
		this.stats = stats;
		this.attributeChangedCallback();
	}

	postRender() {
		this.updateGameStats();
	}

	render() {
		return (
			this.stats &&
			`
            <div class="rounded bg-light game-stats d-flex h-100 w-100 justify-content-center align-items-center position-relative p-2">
                <div class="circle d-flex justify-content-center align-items-center position-relative">
                    <div class="stats-text d-flex flex-column justify-content-center align-items-center position-relative">
                    <img src="/assets/crown.webp" alt="Game Icon" class="crown-icon position-relative">
                        <div class="position-relative d-flex flex-column align-items-center">
                            <h4 class=" stats-fraction d-flex flex-column">
                                <span>
                                    ${this.stats.totalWon}/${
				this.stats.totalPlayed
			}
                                </span>
                                <span class="fs-5">Wins</span>
                            </h4>
                            <h4 class="position-absolute stats-percent d-flex flex-column">
                                <span>
                                    ${
										this.stats.totalPlayed !== 0
											? Math.round(
													(this.stats.totalWon *
														100) /
														this.stats.totalPlayed
											  )
											: 0
									}%
                                </span>
                                <span class="fs-5">Win Rate</span>
                            </h4>
                        </div>
                    </div>
                </div>
                <div class="breakdown d-flex flex-column">
                    <p class="d-flex align-items-baseline my-1">
                        <span><i class="bi bi-joystick"></i> Local Pong</span>
                        <span class="ms-auto">${this.stats.localWon}/${
				this.stats.localPlayed
			}</span>
                    </p>
                    <div class="progress local">
                        <div class="progress-bar" style="width: ${
							(this.stats.localWon / this.stats.localPlayed) * 100
						}%;"></div>
                    </div>

                    <p class="d-flex align-items-baseline my-1">
                        <span><i class="bi bi-people-fill"></i> Remote Pong</span>
                        <span class="ms-auto">${this.stats.remoteWon}/${
				this.stats.remotePlayed
			}</span>
                    </p>
                    <div class="progress remote">
                        <div class="progress-bar" style="width: ${
							(this.stats.remoteWon / this.stats.remotePlayed) *
							100
						}%;"></div>
                    </div>

                    <p class="d-flex align-items-baseline my-1">
                        <span><i class="bi bi-grid-3x3-gap-fill"></i> Tic Tac Toe</span>
                        <span class="ms-auto">${this.stats.tttWon}/${
				this.stats.tttPlayed
			}</span>
                    </p>
                    <div class="progress ttt">
                        <div class="progress-bar" style="width: ${
							(this.stats.tttWon / this.stats.tttPlayed) * 100
						}%;"></div>
                    </div>
                </div>
            </div>
        `
		);
	}

	style() {
		return `
        <style>
            .crown-icon {
                transform: translateY(50%);
                top: -15px;
                width: 40px;
                height: auto;
            }

            .progress {
                border-radius:0 !important;
                height:12px!important;
                margin-bottom: 8px;
            }

            .progress-bar {
                height: 100%;
                transition: width 0.5s ease-in-out;
            }

            .local .progress-bar {
                background-color: ${this.colors.localWonColor};
            }

            .remote .progress-bar {
                background-color: ${this.colors.remoteWonColor};
            }

            .ttt .progress-bar {
                background-color: ${this.colors.tttWonColor};
            }

            .game-stats {
                --bs-bg-opacity: .7;
                width: 150px;
                height: 150px;
            }

            .circle {
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
                background: ${this.colors.gapColor};
                border-radius: 50%;
                background-color: var(--sky-200);
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
		const circle = document.querySelector(".circle");
		if (!circle) return;

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

		circle.style.background = `conic-gradient(
            ${this.colors.gapColor} 0% 2%,

            ${this.colors.localWonColor} 2% ${2 + localWonPercent}%,
            ${this.colors.localPlayedColor} ${2 + localWonPercent}% ${
			2 + localPercent
		}%,

        ${this.colors.gapColor} ${2 + localPercent}% ${4 + localPercent}%,

            ${this.colors.remoteWonColor} ${4 + localPercent}% ${
			4 + localPercent + remoteWonPercent
		}%,
            ${this.colors.remotePlayedColor} ${
			4 + localPercent + remoteWonPercent
		}% ${4 + localPercent + remotePercent}%,

        ${this.colors.gapColor} ${4 + localPercent + remotePercent}% ${
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
