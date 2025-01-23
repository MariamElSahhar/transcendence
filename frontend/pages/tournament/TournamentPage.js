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
        this.maxScore = 5;
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
            <div id="player-setup" class="p-3 card shadow p-5 mx-auto border-warning rounded bg-light " style="max-width: 400px; margin: 100px auto 0;">
                <div class="text-center p-3 rounded mb-4 bg-danger text-warning  border-white">
					<h3 class="fw-bold  m-0">Setup Tournament</h3>
				</div>
                <form id="player-form">
                    <div class="mb-3">
                        <label for="player1-name" class="form-label">Registered Player:</label>
                        <input type="text" id="player1-name" name="player1-name" class="form-control border border-secondary text-dark" value="${firstPlayerName}" disabled />
                    </div>
                    ${this.renderPlayerInputs()}
                    <div id="error-message" class="text-danger mt-2"></div>
                    <button type="submit" class="btn btn-warning w-100 fw-bold border border-primary text-dark" disabled>Start Tournament</button>
                </form>
            </div>
            <div id="container" class="m-2 position-relative" style="display:none;"></div>
        `;

        this.container = this.querySelector("#container");
        this.setupPlayerForm();
    }

    renderPlayerInputs() {
        let inputs = "";
        for (let i = 2; i <= 4; i++) {
            inputs += `
                <div class="mb-3">
                    <label for="player${i}-name" class="form-label">Player ${i} Name:</label>
                    <input type="text" id="player${i}-name" name="player${i}-name" class="form-control border border-secondary text-dark" required />
                </div>`;
        }
        return inputs;
    }

    setupPlayerForm() {
        const form = this.querySelector("#player-form");
        const submitButton = form.querySelector('button[type="submit"]');
        const errorMessage = this.querySelector("#error-message");

        // Enable/disable the submit button dynamically
        form.addEventListener("input", () => {
            const allFilled = [...form.querySelectorAll("input:not([disabled])")].every(
                (input) => input.value.trim() !== ""
            );

            if (allFilled) {
                submitButton.removeAttribute("disabled");
                errorMessage.textContent = "";
                errorMessage.style.display = "none";
            } else {
                submitButton.setAttribute("disabled", "");
                errorMessage.textContent = "All player names must be filled.";
                errorMessage.style.display = "block";
            }
        });

        // Handle form submission
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            errorMessage.textContent = ""; // Clear previous errors
            errorMessage.style.display = "none";

            // Clear previous players to avoid duplicates
            this.players = [];

            // Collect player names
            const playerIds = ["player1-name", "player2-name", "player3-name", "player4-name"];
            this.players = playerIds.map((id) => form.querySelector(`#${id}`).value.trim());

            // Validate player names
            if (!this.areValidNames(this.players)) {
                errorMessage.style.display = "block";
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

        // Check for empty names
        if (players.some((player) => !player)) {
            errorMessage.textContent = "All player names must be filled.";
            errorMessage.style.display = "block";
            return false;
        }

        // Check for duplicate names
        const uniquePlayers = new Set(players);
        if (uniquePlayers.size !== players.length) {
            errorMessage.textContent = "Player names must be unique.";
            errorMessage.style.display = "block";
            return false;
        }

        return true;
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
            this.createStartGameCard(player1, player2);
        } else if (this.currentMatchIndex === 2 && this.winners.length === 2) {
            this.matches[2] = [this.winners[0], this.winners[1]];
            const [finalist1, finalist2] = this.matches[2];
            this.scores = [0, 0];
            this.createStartGameCard(finalist1, finalist2);
        } else {
            this.showTournamentWinner();
        }
    }

    createStartGameCard(player1, player2) {
        this.createOverlay(`
            <div class="card text-center text-dark bg-light" style="width: 24rem;">
                <div class="card-body">
                    <h2 class="card-text mb-3">Match Start Between</h2>
                    <img src="/pages/tictactoe/shroom.png" alt="Game Icon" class="card-image">
                    <div class="d-flex justify-content-between align-items-center gap-3 mb-3">
                        <div>
                            <h5 class="text-primary" style="font-weight:bold">Left Player</h5>
                            <p>${player1}</p>
                        </div>
                        <div>
                            <h5 class="text-danger" style="font-weight:bold">Right Player</h5>
                            <p>${player2}</p>
                        </div>
                    </div>
                    <button id="start-match-button" class="btn btn-primary">Start Match</button>
                </div>
            </div>
        `, () => {
            this.startCountdown(player1, player2);
        });
    }

    startCountdown(player1, player2) {
        this.createOverlay(`
            <div class="card text-center text-dark bg-light" style="width: 18rem;">
                <div class="card-body">
                    
                    <h1 id="countdown-display" class="display-1 fw-bold">3</h1>
                    <img src="/pages/tictactoe/shroom.png" alt="Game Icon" class="card-image">
					<p class="card-text">Get ready! The game will start soon.</p>
                </div>
            </div>
        `);

        let countdown = 3;
        this.updateCountdownDisplay(countdown);

        const countdownInterval = setInterval(() => {
            countdown -= 1;
            this.updateCountdownDisplay(countdown);

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                this.removeOverlay();
                this.startGame(player1, player2);
            }
        }, 1000);
    }

    updateCountdownDisplay(secondsLeft) {
        const countdownElement = this.overlay.querySelector("#countdown-display");
        if (countdownElement) {
            countdownElement.textContent = secondsLeft;
        }
    }

    startGame(player1, player2) {
        if (!player1 || !player2) {
            console.error("Invalid player names for the match.");
            return;
        }

        console.log(`Starting match between ${player1} and ${player2}`);

        if (this.engine) {
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

        if (this.currentMatchIndex < 2) {
            this.createOverlay(`
                <div class="card text-center bg-light text-dark" style="width: 30rem;">
                    <div class="card-body">
                        <img src="/pages/tictactoe/shroom.png" alt="Game Icon" class="card-image">
                        <h3 class="fw-bold text-light"> ${winner} wins! 🏆  </h3>
						<h3 class="fw-bold text-light"> ${loser} is eliminated! ❌ </h3>
                        <button class="btn btn-primary mt-3">Next Match</button>
                    </div>
                </div>
            `, () => {
                this.currentMatchIndex++;
                this.startNextMatch();
            });
        } else {
            this.showTournamentWinner();
        }
    }

    showTournamentWinner() {
        const champion = this.winners[this.winners.length - 1];
        this.createOverlay(`
            <div class="card text-center bg-light text-dark" style="width: 24rem;">
                <div class="card-body">
                    <img src="/pages/tictactoe/shroom.png" alt="Game Icon" class="card-image">
                    <h1 class="display-4 fw-bold">${champion} </h1>
                    <h1 class="display-4 fw-bold"> is the Tournament Champion! </h1>
                    <h1 class="display-4 fw-bold"> 🏆 </h1>
                    <button class="btn btn-primary mt-3">Finish</button>
                </div>
            </div>
        `, () => {
            this.declareWinner();
        });
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
                console.warn("No button found in overlay content, proceeding without button.");
                callback();
            }
        }
    }

    displayRanks() {
        const sortedPlayers = Object.entries(this.playerWins).sort(
            (a, b) => b[1] - a[1]
        );
        const rankHtml = sortedPlayers.map(
            ([player, wins], index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${player}</td>
                <td>${wins}</td>
            </tr>`
        ).join("");

        this.createOverlay(`
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
					<button class="btn btn-secondary mt-3" onclick="window.location.href='/home'">Go Home</button>
                </div>
            </div>
        `);
    }

    declareWinner() {
        this.displayRanks();
    }

    removeOverlay() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }
}

customElements.define("tournament-page", TournamentPage);


