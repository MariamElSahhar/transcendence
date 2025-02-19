import { Component } from "../Component.js";
import { Engine } from "./Engine.js";
import { getUserSessionData } from "../../scripts/utils/session-manager.js";
import { addLocalGame } from "../../scripts/clients/gamelog-client.js";
import { isAuth } from "../../scripts/utils/session-manager.js";
import {
	renderEndGameCard,
	renderGameInfoCard,
	renderCountdownCard,
} from "../local-game/Overlays.js";

export class TournamentPage extends Component {
	constructor() {
		super();
		this.me = getUserSessionData();
		this.container = null;
		this.engine = null;
		this.overlay = null;
		this.players = [];
		this.currentMatchIndex = 0;
		this.maxScore = window.APP_CONFIG.pointsToWinPongMatch;
		this.scores = [
			[0, 0],
			[0, 0],
			[0, 0],
		];
		this.matches = [];
		this.winners = [];
		this.playerWins = {}; // Tracks the number of wins for each player
		this.countDownIntervalId = null;
	}

	connectedCallback() {
		this.players.push(this.me.username);
		super.connectedCallback();
	}

	disconnectedCallback() {
		if (this.engine) {
			this.engine.cleanUp();
			this.engine = null;
		}
		if (this.countDownIntervalId) {
			clearInterval(this.countDownIntervalId);
			this.countDownIntervalId = null;
		}
		super.disconnectedCallback();
	}

	render() {
		return `
			<div id="container" class="d-flex justify-content-center align-items-center w-100 h-100">
				<div id="player-setup" class="p-3 card shadow p-5 bg-light">
					<h3 class="w-100 text-center">Setup Tournament</h3>
					<form id="player-form" class="d-flex w-100 flex-column gap-2">
						<input type="text" id="player1-name" name="player1-name" class="form-control" value="${this.me.username}" disabled />
						<input type="text" id="player2-name" name="player2-name" class="form-control" required placeholder="Player 2"/>
						<input type="text" id="player3-name" name="player3-name" class="form-control" required placeholder="Player 3"/>
						<input type="text" id="player4-name" name="player4-name" class="form-control" required placeholder="Player 4"/>
						<div id="error-message" class="alert alert-danger d-none" role="alert"></div>
						<button id="submit-players" type="submit" class="btn w-100" disabled>Start Tournament</button>
					</form>
				</div>
            </div>
        `;
	}

	postRender() {
		this.container = this.querySelector("#container");
		const form = this.querySelector("#player-form");
		const submitButton = this.querySelector("#submit-players");
		const errorMessage = this.querySelector("#error-message");

		// Enable/disable the submit button dynamically
		form.addEventListener("input", () => {
			const allFilled = [
				...form.querySelectorAll("input:not([disabled])"),
			].every((input) => input.value.trim() !== "");

			if (allFilled) {
				submitButton.removeAttribute("disabled");
			} else {
				submitButton.setAttribute("disabled", "");
			}
		});

		// Handle form submission
		form.addEventListener("submit", (event) => {
			event.preventDefault();
			errorMessage.textContent = ""; // Clear previous errors
			errorMessage.classList.add("d-none");

			// Clear previous players to avoid duplicates
			this.players = [];

			// Collect player names
			const playerIds = [
				"player1-name",
				"player2-name",
				"player3-name",
				"player4-name",
			];
			this.players = playerIds.map((id) =>
				form.querySelector(`#${id}`).value.trim()
			);

			// Validate player names
			if (!this.areValidNames(this.players)) {
				errorMessage.classList.remove("d-none");
				return; // Stop if validation fails
			}

			// Initialize player win counts
			this.players.forEach((player) => {
				this.playerWins[player] = 0;
			});

			// Proceed to initialize the tournament
			this.initTournament();
		});
	}

	areValidNames(players) {
		const errorMessage = this.querySelector("#error-message");

		// Check for duplicate names
		const uniquePlayers = new Set(players);
		if (uniquePlayers.size !== players.length) {
			errorMessage.textContent = "Player names must be unique.";
			errorMessage.classList.remove("d-none");
			return false;
		}

		return true;
	}

	initTournament() {
		this.winners = [];
		this.currentMatchIndex = 0;

		// Shuffle players to create random matchups
		this.shufflePlayers();
		this.matches = [
			[this.players[0], this.players[1]], // Match 1
			[this.players[2], this.players[3]], // Match 2
			[null, null], // Placeholder for the Final Match
		];

		this.querySelector("#player-setup").style.display = "none";
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
	}

	// TODO improve
	startNextMatch() {
		if (this.currentMatchIndex <= 2) {
			if (this.currentMatchIndex === 2 && this.winners.length === 2) {
				this.matches[2] = [this.winners[0], this.winners[1]];
			}
			const [player1, player2] = this.matches[this.currentMatchIndex];
			this.engine = new Engine(
				this,
				[player1, player2],
				(winner, score1, score2) =>
					this.endMatch(winner, player1, player2, score1, score2)
			);
			const { overlay, countDownIntervalId } = renderGameInfoCard(
				this,
				this.container,
				player1,
				player2,
				this.engine,
				this.currentMatchIndex
			);
			this.overlay = overlay;
			this.countDownIntervalId = countDownIntervalId;
		} else {
			this.showTournamentWinner();
		}
	}

	startGame(player1, player2) {
		if (this.engine) {
			this.engine.cleanUp();
			this.engine = null;
		}

		this.container.innerHTML = "";
		this.engine = new Engine(this, (winner, score1, score2) =>
			this.endMatch(winner, player1, player2, score1, score2)
		);
		this.engine.startGame([player1, player2]);
	}

	async endMatch(winner, player1, player2, score1, score2) {
		this.playerWins[winner] += 1;
		this.winners.push(winner);

		const loser = winner === player1 ? player2 : player1;
		this.scores[this.currentMatchIndex] = [score1, score2];
		// if one of the players is the main player
		if (player1 == this.me.username || player2 == this.me.username) {
			if (!(await isAuth())) window.redirect("/");
			await addLocalGame({
				my_score: this.me.username == player1 ? score1 : score2,
				opponent_username:
					this.me.username != player1 ? player1 : player2,
				opponent_score: this.me.username == player1 ? score2 : score1,
				tournament_round: this.currentMatchIndex + 1,
			});
		}

		if (this.currentMatchIndex < 2) {
			this.createOverlay(
				`
                <div class="card text-center bg-light text-dark" style="width: 30rem;">
                    <div class="card-body">
                        <img src="/pages/tictactoe/shroom.png" alt="Game Icon" class="card-image">
                        <h3> ${winner} wins! 🏆  </h3>
						<h3> ${loser} is eliminated! ❌ </h3>
                        <button class="btn btn-primary mt-3">Next Match</button>
                    </div>
                </div>
            `,
				() => {
					this.currentMatchIndex++;
					this.startNextMatch();
				}
			);
		} else {
			this.showTournamentWinner();
		}
	}

	showTournamentWinner() {
		const champion = this.winners[this.winners.length - 1];
		this.createOverlay(
			`
            <div class="card text-center bg-light text-dark" style="width: 30rem;">
                <div class="card-body">
                    <img src="/pages/tictactoe/shroom.png" alt="Game Icon" class="card-image">
                    <h1 class="display-4 fw-bold">${champion} </h1>
                    <h1 class="display-4 fw-bold"> is the Tournament Champion! </h1>
                    <h1 class="display-4 fw-bold"> 🏆 </h1>
                    <button class="btn btn-primary mt-3">Finish</button>
                </div>
            </div>
        `,
			() => {
				this.displayRanks();
			}
		);
	}

	createOverlay(contentHTML, callback = null) {
		this.overlay = document.createElement("div");
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
		this.overlay.innerHTML = contentHTML;
		this.container.appendChild(this.overlay);

		if (callback) {
			const button = this.overlay.querySelector("button");
			if (button) {
				button.addEventListener("click", () => {
					this.removeOverlay();
					callback();
				});
			} else {
				console.warn(
					"No button found in overlay content, proceeding without button."
				);
				callback();
			}
		}
	}

	displayRanks() {
		const sortedPlayers = Object.entries(this.playerWins).sort(
			(a, b) => b[1] - a[1]
		);
		this.createOverlay(`
            <div class="card text-center">
                <div class="card-body">
                <h2 class="card-title">Tournament Ranks</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Wins</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedPlayers
								.map(
									([player, wins], index) => `
								<tr>
									<td>${index + 1}</td>
									<td>${player}</td>
									<td>${wins}</td>
								</tr>`
								)
								.join("")}
                        </tbody>
                    </table>
                    <button class="btn btn-primary mt-3" onclick="window.redirect('/play/tournament')">New Tournament</button>
					<button class="btn btn-secondary mt-3" onclick="window.location.href='/home'">Go Home</button>
                </div>
            </div>
        `);
	}

	removeOverlay() {
		if (this.overlay) {
			this.overlay.remove();
			this.overlay = null;
		}
	}
}

customElements.define("tournament-page", TournamentPage);
