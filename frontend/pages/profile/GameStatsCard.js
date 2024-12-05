import { Component } from "../Component.js";

export class GameStatsCard extends Component {
	constructor() {
		super();
		this.gamelog = {};
		this.stats = {};
	}

	renderGameStats(matchHistory) {
		this.gamelog = matchHistory;
		this.update();
	}

	postRender() {
		this.updateGameStats();
	}

	render() {
		return `
            <div class="game-stats">
                <div class="circle">
                    <div class="stats-text">
                         ${this.stats.totalWonGames}/${this.stats.totalPlayedGames}
                    </div>
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
        </style>`;
	}

	updateGameStats() {
		const localPlayed = 20;
		const localWon = 5;
		const remotePlayed = 10;
		const remoteWon = 5;
		const tttPlayed = 10;
		const tttWon = 5;
		const totalPlayed = localPlayed + remotePlayed + tttPlayed;

		this.stats.totalPlayedGames = localPlayed + tttPlayed + remotePlayed;
		this.stats.totalWonGames = localWon + tttWon + remoteWon;

		const localPercent = (localPlayed / totalPlayed) * 100;
		const localWonPercent = (localWon / totalPlayed) * 100;
		const remotePercent = (remotePlayed / totalPlayed) * 100;
		const remoteWonPercent = (remoteWon / totalPlayed) * 100;
		const tttPercent = (tttPlayed / totalPlayed) * 100;
		const tttWonPercent = (tttWon / totalPlayed) * 100;

		const circle = document.querySelector(".circle");
		circle.style.background = `conic-gradient(
            cornflowerblue 0% ${localWonPercent}%,
            aliceblue ${localWonPercent}% ${localPercent}%,

            indigo ${localPercent}% ${localPercent + remoteWonPercent}%,
            lavender ${localPercent + remoteWonPercent}% ${
			localPercent + remotePercent
		}%,

            pink ${localPercent + remotePercent}% ${
			localPercent + remotePercent + tttWonPercent
		}%,
            lavenderblush ${localPercent + remotePercent + tttWonPercent}% 100%
        )`;
	}
}

customElements.define("game-stats", GameStatsCard);
