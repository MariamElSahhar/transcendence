import { Component } from "../Component.js";
import { Engine } from "./Engine.js";
import { getUserSessionData } from "../../scripts/utils/session-manager.js";

export class TournamentPage extends Component {
	constructor() {
		super();
		this.container = null;
		this.engine = null;
		this.overlay = null;
		this.players = [];
		this.currentMatchIndex = 0;
		this.maxScore = 1;
		this.scores = [0, 0];
		this.matches = [];
		this.winners = [];
		this.playerWins = {}; // Tracks the number of wins for each player
	}

	connectedCallback() {
		this.setupTournament();
	}

	setupTournament() {
		const userData = getUserSessionData();
		const firstPlayerName = userData.username || "Player 1";
		this.players.push(firstPlayerName);

		this.innerHTML = `
            <div id="player-setup" class="p-3 border rounded bg-light" style="max-width: 400px; margin: 40px auto 0;">
                <h3 class="text-center">Setup Tournament</h3>
                <form id="player-form">
                    ${this.renderPlayerInputs()}
                    <button type="submit" class="btn btn-primary mt-3 w-100">Start Tournament</button>
                </form>
            </div>
            <div id="container" class="m-2 position-relative" style="display:none;"></div>
        `;

		this.container = this.querySelector("#container");
		this.setupPlayerForm();
	}

	renderPlayerInputs() {
		let inputs = "";
		for (let i = 1; i <= 4; i++) {
			inputs += `
                <div class="mb-3">
                    <label for="player${i}-name" class="form-label">Player ${i} Name:</label>
                    <input type="text" id="player${i}-name" name="player${i}-name" class="form-control" required />
                </div>`;
		}
		return inputs;
	}

	setupPlayerForm() {
		const form = this.querySelector("#player-form");

		form.addEventListener("submit", (event) => {
			event.preventDefault();
			this.players = [];
			for (let i = 1; i <= 4; i++) {
				const playerName = form.querySelector(`#player${i}-name`).value;
				this.players.push(playerName || `Player ${i}`);
			}

			// Initialize the win counts for each player
			this.players.forEach((player) => {
				this.playerWins[player] = 0;
			});

			this.initTournament();
		});
	}

	initTournament() {
		this.winners = [];
		this.scores = [0, 0];
		this.currentMatchIndex = 0;

		// Shuffle players to create random matchups
		this.shufflePlayers();
		this.matches = [
			[this.players[0], this.players[1]], // Match 1
			[this.players[2], this.players[3]], // Match 2
			[null, null], // Placeholder for the Final Match
		];

		this.querySelector("#player-setup").style.display = "none";
		this.container.style.display = "block";
		this.startNextMatch();
	}

	shufflePlayers() {
		for (let i = this.players.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.players[i], this.players[j]] = [
				this.players[j],
				this.players[i],
			];
		}
		console.log("Shuffled players:", this.players);
	}

	startNextMatch() {
		if (this.currentMatchIndex < 2) {
			const [player1, player2] = this.matches[this.currentMatchIndex];
			this.scores = [0, 0];
			this.startCountdown(player1, player2);
		} else if (this.currentMatchIndex === 2 && this.winners.length === 2) {
			// Final match between the winners of Match 1 and Match 2
			this.matches[2] = [this.winners[0], this.winners[1]];
			const [finalist1, finalist2] = this.matches[2];
			this.scores = [0, 0];
			this.startCountdown(finalist1, finalist2);
		} else {
			this.declareWinner();
		}
	}

	startCountdown(player1, player2) {
		this.createCountdownCard(`Next Match: ${player1} vs ${player2}`);

		let countdown = 3;
		this.updateCountdownDisplay(countdown);

		const countdownInterval = setInterval(() => {
			countdown -= 1;
			this.updateCountdownDisplay(countdown);

			if (countdown <= 0) {
				clearInterval(countdownInterval);
				this.removeCountdownCard();
				this.startGame(player1, player2);
			}
		}, 1000);
	}

	createCountdownCard(message) {
		this.overlay = document.createElement("div");
		this.overlay.id = "countdown-card";
		this.overlay.classList.add(
			"position-fixed",
			"top-0",
			"start-0",
			"w-100",
			"h-100",
			"d-flex",
			"justify-content-center",
			"align-items-center",
			"bg-dark",
			"bg-opacity-75",
			"text-white"
		);
		this.overlay.style.zIndex = "9999";
		this.overlay.innerHTML = `
            <div class="card text-center text-dark bg-light" style="width: 18rem;">
                <div class="card-body">
                    <h3 class="card-text mb-3">${message}</h3>
                    <h1 id="countdown-display" class="display-1 fw-bold">3</h1>
                </div>
            </div>
        `;
		this.container.appendChild(this.overlay);
	}

	updateCountdownDisplay(secondsLeft) {
		const countdownElement =
			this.overlay.querySelector("#countdown-display");
		if (countdownElement) {
			countdownElement.textContent = secondsLeft;
		}
	}

	displayRanks() {
		// Sort players by their win count in descending order
		const sortedPlayers = Object.entries(this.playerWins).sort(
			(a, b) => b[1] - a[1]
		);

		// Generate the HTML for the ranks table
		let rankHtml = sortedPlayers
			.map(
				([player, wins], index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${player}</td>
                <td>${wins}</td>
            </tr>
        `
			)
			.join("");

		// Create the overlay to display the ranks
		this.overlay = document.createElement("div");
		this.overlay.id = "ranks-overlay";
		this.overlay.classList.add(
			"position-fixed",
			"top-0",
			"start-0",
			"w-100",
			"h-100",
			"d-flex",
			"justify-content-center",
			"align-items-center",
			"bg-dark",
			"bg-opacity-75",
			"text-white"
		);
		this.overlay.style.zIndex = "9999";
		this.overlay.innerHTML = `
            <div class="card text-center text-dark bg-light" style="width: 24rem;">
                <div class="card-header">
                    <h2 class="card-title">Tournament Ranks</h2>
                </div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Wins</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rankHtml}
                        </tbody>
                    </table>
                    <button class="btn btn-primary mt-3" onclick="window.location.reload()">Restart Tournament</button>
                </div>
            </div>
        `;
		this.container.appendChild(this.overlay);
	}

	removeCountdownCard() {
		if (this.overlay) {
			this.overlay.remove();
			this.overlay = null;
		}
	}
	endMatch(winner, player1, player2) {
		console.log(`${winner} won the match`);

		this.playerWins[winner] += 1;
		this.winners.push(winner);

		const loser = winner === player1 ? player2 : player1;

		this.showOverlay(
			`🏆 ${winner} wins! ❌ ${loser} is eliminated!`,
			() => {
				this.currentMatchIndex++;
				this.startNextMatch();
			}
		);
	}

	startGame(player1, player2) {
		if (!player1 || !player2) {
			console.error("Invalid player names for the match.");
			return;
		}

		console.log(`Starting match between ${player1} and ${player2}`);

		if (this.engine) {
			console.log("Cleaning up the previous engine instance...");
			this.engine.cleanUp();
			this.engine = null;
		}

		this.container.innerHTML = "";
		this.container.style.display = "block";

		this.engine = new Engine(this, (winner) =>
			this.endMatch(winner, player1, player2)
		);
		this.engine.startGame([player1, player2]);
	}

	endMatch(winner, player1, player2) {
		console.log(`${winner} won the match`);

		this.playerWins[winner] += 1;
		this.winners.push(winner);

		const loser = winner === player1 ? player2 : player1;

		this.showOverlay(
			`🏆 ${winner} wins! ❌ ${loser} is eliminated!`,
			() => {
				this.currentMatchIndex++;
				this.startNextMatch();
			}
		);
	}

	showOverlay(message, callback) {
		this.overlay = document.createElement("div");
		this.overlay.id = "overlay";
		this.overlay.classList.add(
			"position-fixed",
			"top-0",
			"start-0",
			"w-100",
			"h-100",
			"d-flex",
			"justify-content-center",
			"align-items-center",
			"bg-dark",
			"bg-opacity-75",
			"text-white"
		);
		this.overlay.style.zIndex = "9999";
		this.overlay.innerHTML = `
            <div class="card text-center bg-light text-dark" style="width: 24rem;">
                <div class="card-body">
                    <h1 class="display-4 fw-bold">${message}</h1>
                </div>
            </div>
        `;
		this.container.appendChild(this.overlay);

		// Remove the overlay after 3 seconds and call the callback
		setTimeout(() => {
			this.overlay.remove();
			callback();
		}, 3000);
	}

	declareWinner() {
		this.displayRanks();
	}
}

customElements.define("tournament-page", TournamentPage);
