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
            <div class="game-stats d-flex flex-row w-50 gap-5 justify-content-start w-100 p-3">
                <div class="circle">
                    <div class="stats-text">
                         <span class="stats-fraction">${
								this.stats.totalWonGames
							}/${this.stats.totalPlayedGames}</span>
                         <span class="stats-percent ">${
								(this.stats.totalWonGames * 100) /
								this.stats.totalPlayedGames
							}%</span>
                    </div>
                </div>
                <div class="d-flex flex-column w-50">
                <p>
                        ${this.stats.localWon}/${
			this.stats.localPlayed
		} Local Pong
                    </p>
                                <p>${this.stats.remoteWon}/${
			this.stats.remotePlayed
		} Remote Pong</p>
                                <p>${this.stats.tttWon}/${
			this.stats.tttPlayed
		} Tic Tac Toe</p>
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
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .circle {
            position: relative;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: conic-gradient(
                lightgreen 0% 100%);
            display: flex;
            justify-content: center;
            align-items: center;
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
            display: none;
        }

        .circle:hover .stats-percent {
            display: inline;
        }

        .circle:hover .stats-fraction {
            display: none;
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
