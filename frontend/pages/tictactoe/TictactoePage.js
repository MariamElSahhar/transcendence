import { Component } from "../Component.js";
import { get, post } from "../../scripts/utils/http-requests.js";
import { getUserSessionData } from "../../../scripts/utils/session-manager.js";

const BASE_URL = "http://127.0.0.1:8000/api/tictactoe";

class TicTacToePage extends Component {
	constructor() {
		super();
		this.myself = getUserSessionData().username;
		this.inGame = false;
		this.inMatchmaking = false;
		this.gameInfoGetIntervalFd = null;

		// Bo3 information
		this.gameId = -1;
		this.status = "";
		this.player1 = "";
		this.player2 = "";
		this.mapRound1 = Array(9).fill(null);
		this.mapRound2 = Array(9).fill(null);
		this.mapRound3 = Array(9).fill(null);
		this.currentRound = 0;
		this.nextToPlay = "";
		this.lastPlayTime = 0;
		this.winnerRound1 = "";
		this.winnerRound2 = "";
		this.winnerRound3 = "";

		this.scoreA = 0;
		this.scoreB = 0;
		this.winner = null; // Winner status
	}

	applyGameInfo(gameInfo) {
		const lastStatus = this.inGame
			? "PLAYING"
			: this.inMatchmaking
			? "MATCHMAKING"
			: "NONE";
		const previousLastPlay = this.lastPlayTime;

		if (gameInfo && gameInfo.status === "PLAYING") {
			this.inGame = true;

			this.gameId = gameInfo.id;
			this.status = gameInfo.status;
			this.player1 = gameInfo.player1;
			this.player2 = gameInfo.player2;
			this.mapRound1 = gameInfo.mapRound1;
			this.mapRound2 = gameInfo.mapRound2;
			this.mapRound3 = gameInfo.mapRound3;
			this.currentRound = gameInfo.currentRound;
			this.nextToPlay = gameInfo.nextToPlay;
			this.lastPlayTime = gameInfo.lastPlayTime;
			this.winnerRound1 = gameInfo.winnerRound1;
			this.winnerRound2 = gameInfo.winnerRound2;
			this.winnerRound3 = gameInfo.winnerRound3;

			this.scoreA = (() => {
				let score = 0;

				if (this.winnerRound1 === this.player1) score++;
				if (this.winnerRound2 === this.player1) score++;
				if (this.winnerRound3 === this.player1) score++;

				return score;
			})();

			this.scoreB = (() => {
				let score = 0;

				if (this.winnerRound1 === this.player2) score++;
				if (this.winnerRound2 === this.player2) score++;
				if (this.winnerRound3 === this.player2) score++;

				return score;
			})();

			if (
				lastStatus !== "PLAYING" ||
				previousLastPlay !== this.lastPlayTime
			) {
				this.menuActivation(false);
				this.refreshScoresHtml();
				this.refreshBoardWrapperHtml();
			}

			// TODO: handle winner
			return;
		}

		if (gameInfo && gameInfo.status === "MATCHMAKING") {
			this.inMatchmaking = true;
			this.gameId = gameInfo.id;
			this.status = gameInfo.status;
			this.player1 = gameInfo.player1;
			this.player2 = gameInfo.player2;

			if (lastStatus !== "MATCHMAKING") {
				this.menuActivation(true);
				this.changePlayBtnText("Waiting for Player...");
				this.refreshScoresHtml();
				this.refreshBoardWrapperHtml();
			}
			return;
		}

		if (lastStatus !== "NONE") {
			this.menuActivation(true);
			this.changePlayBtnText("Play");
			this.refreshScoresHtml();
			this.refreshBoardWrapperHtml();
		}

		// if (lastStatus !== "FINISHED") {
		// 	this.menuActivation(true);
		// 	this.changePlayBtnText("Play Again?");
		// }

		this.inGame = false;
		this.inMatchmaking = false;
		this.gameId = -1;
		this.status = "";
		this.player1 = "";
		this.player2 = "";
		this.mapRound1 = Array(9).fill(null);
		this.mapRound2 = Array(9).fill(null);
		this.mapRound3 = Array(9).fill(null);
		this.currentRound = 0;
		this.nextToPlay = "";
		this.lastPlayTime = 0;
		this.winnerRound1 = "";
		this.winnerRound2 = "";
		this.winnerRound3 = "";

		this.scoreA = 0;
		this.scoreB = 0;
		this.winner = null;
	}

	menuActivation(b) {
		const tictactoe = this.querySelector(".tictactoe");

		if (b) tictactoe.classList.add("menu-activated");
		else tictactoe.classList.remove("menu-activated");
	}

	changePlayBtnText(text) {
		const playBtn = this.querySelector(".play-btn");
		playBtn.innerHTML = text;
	}

	async connectedCallback() {
		super.connectedCallback();

		this.subscribeToGameInfo();
	}

	getBoard() {
		if (this.currentRound === 1) return this.mapRound1;
		if (this.currentRound === 2) return this.mapRound2;
		if (this.currentRound === 3) return this.mapRound3;

		return Array(9).fill(null);
	}

	getBoardWrapperHtml() {
		let boardHTML = '<div class="board">';

		const board = this.getBoard();

		board.forEach((cell, index) => {
			boardHTML += `
				<div class="cell" data-index="${index}">
					${
						cell === "X"
							? `<img src="/pages/tictactoe/plant.png" alt="X" />`
							: cell === "O"
							? `<img src="/pages/tictactoe/shroom.png" alt="O" />`
							: ""
					}
				</div>
			`;
		});

		boardHTML += "</div>";

		return boardHTML;
	}

	refreshBoardWrapperHtml() {
		const container = document.querySelector(".board-wrapper");
		container.innerHTML = this.getBoardWrapperHtml();

		const cells = this.querySelectorAll(".cell");

		cells.forEach((cell) => {
			this.addComponentEventListener(
				cell,
				"click",
				this.handleCellClick,
				this
			);
		});
	}

	refreshScoresHtml() {
		const container = document.querySelector(".scores");
		container.innerHTML = this.getScoresHtml();
	}

	getScoresHtml() {
		return `
			<div class="player1">
				<img class="star ${
					this.player1 === this.nextToPlay ? "" : "hidden"
				}" src="/pages/tictactoe/star.png" alt="X" />

				<div class="score-wrapper">
					<span class="score">${this.scoreA}</span>
					<img class="shroom" src="/pages/tictactoe/plant.png" alt="X" />
				</div>

				<div class="player-name">${this.player1}</div>
			</div>

			<div class="player2">
				<img class="star ${
					this.player2 === this.nextToPlay ? "" : "hidden"
				}" src="/pages/tictactoe/star.png" alt="X" />

				<div class="score-wrapper">
					<span class="score">${this.scoreB}</span>
					<img class="shroom" src="/pages/tictactoe/shroom.png" alt="X" />
				</div>

				<div class="player-name">${this.player2}</div>
			</div>
		 `;
	}

	render() {
		return `
			<div class="tictactoe">
				<div class="sky"></div>
				<img class="title-img" src="/pages/tictactoe/title.png" alt="X" />

				<div class="board-wrapper">
					${this.getBoardWrapperHtml()}

					<div class="play-btn">Play</div>
				</div>

				<div class="scores">
					${this.getScoresHtml()}
				</div>

				<div class="floor" />
			</div>
		`;
	}

	style() {
		return `
			<style>
				.tictactoe {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					background-color: rgb(135, 206, 235);
					height: 100%;
					width: 100%;
					position: relative;
					overflow: hidden;
				}

				.board-wrapper {
					position: relative;
					z-index: 3;
				}

				.hidden {
					opacity: 0;
				}

				.menu-activated {
					.board {
						filter: blur(10px);

						.cell {
							cursor: default;
						}
					}

					.scores {
						filter: blur(10px);
					}

					.play-btn {
						display: flex;
						justify-content: center;
						align-items: center;
						cursor: pointer;
					}
				}

				.play-btn {
					display: none;
					width: 10em;
					height: 3em;
					background-color: red;
					position: absolute;
					z-index: 6;
					top: calc(50% - 1.5em);
					left: calc(50% - 5em);
					bottom: auto;
					color: white;
					font-family: 'New Super Mario Font U', sans-serif;
					font-size: 1.5em;
					border: 0.2em solid white;
				}

				.sky {
					display: flex;
					background: url(/pages/tictactoe/sky.png);
					background-size: contain;
					background-repeat: repeat-x;
					position: absolute;
					top: 0;
					left: -400%;
					width: 500%;
					height: 20em;
					animation: move-sky 500s linear infinite;
					z-index: 1;
					opacity: 0.2;
				}

				@keyframes move-sky {
					from {
						transform: translateX(0%);
					}
					to {
						transform: translateX(60%);
					}
				}

				.title-img {
					width: 50em;
					height: 12em;
					z-index: 2;
				}

				.scores {
					display: flex;
					justify-content: space-between;
					align-items: center; /* Ensures vertical alignment */
					width: 90%;
					margin: 0 auto;
					padding: 0;
					-webkit-text-stroke: 5px #000000;
					font-family: 'New Super Mario Font U', sans-serif;
					font-size: 10em;
					color: #ebebeb;
					position: relative;
					bottom: 1.2em;
					z-index: 2;
				}

				.star {
				    left: 0.5em;
					position: relative;
					width: 0.5em;
					height: 0.5em;
				}

				.shroom {
					width: 0.7em;
					height: 0.7em;
				}

				.player-name {
					height: 1em;
					font-size: 0.5em;
					position: relative;
					bottom: 0.6em;
					width: 3em;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.player1 {
					span {
						color: #43b133
					}
				}

				.player2 {
					span {
						color: #e71f07
					}
				}

				.floor {
				    width: 100%;
					height: 10em;
					display: flex;
					background: url(/pages/tictactoe/floor.png);
					background-position: center;
					background-size: contain;
					position: absolute;
					bottom: 0;
					left: 0;
					border-top: 0.4em solid #4c2811;
					z-index: 1;
				}

				.board {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					grid-template-rows: repeat(3, 1fr);
					gap: 10px;
					width: 600px;
					height: 600px;
					z-index: 2;
					position: relative;
				}

				.cell {
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					background: url('/pages/tictactoe/cube.png');  /* Use your pixelated PNG */
					background-size: cover;   /* Make sure it covers the whole cell */
					background-position: center;  /* Center the image */
					cursor: pointer;
					padding: 0.5em;
					font-size: 3em;
					position: relative;
					image-rendering: pixelated;  /* Apply pixelation effect */
					z-index: 2;
				}

				.cell:hover {
					background-color: #e0e0e0;
				}

				img {
					width: 90%;
					height: 90%;
					image-rendering: pixelated;
				}

			</style>
		`;
	}

	postRender() {
		const cells = this.querySelectorAll(".cell");

		cells.forEach((cell) => {
			this.addComponentEventListener(
				cell,
				"click",
				this.handleCellClick,
				this
			);
		});

		const playBtn = this.querySelector(".play-btn");

		this.addComponentEventListener(
			playBtn,
			"click",
			this.handlePlayBtnClick,
			this
		);
	}

	async subscribeToGameInfo() {
		// Already subscribed
		if (this.gameInfoGetIntervalFd !== null) {
			return;
		}

		this.gameInfoGetIntervalFd = setInterval(async () => {
			const game = await this.getGameInfo();

			this.applyGameInfo(game);

			this.render();
		}, 500);
	}

	unsubscribeToGameInfo() {
		if (this.gameInfoGetIntervalFd !== null) {
			clearInterval(this.gameInfoGetIntervalFd);
			this.gameInfoGetIntervalFd = null;
		}
	}

	disconnectedCallback() {
		this.unsubscribeToGameInfo();
		super.disconnectedCallback();
	}

	async joinMatchmaking() {
		try {
			const response = await post(`${BASE_URL}/join_matchmaking/`);
			if (response.message) {
				console.log("Subscribe to matchmaking:", response.message);
				this.inMatchmaking = true;
			}
		} catch (error) {
			console.error("Error subscribing to matchmaking:", error);
		}
	}

	async handlePlayBtnClick(event) {
		if (this.inMatchmaking) {
			return this.cancelMatchmaking();
		}

		return this.joinMatchmaking();
	}

	async cancelMatchmaking() {
		try {
			const response = await post(`${BASE_URL}/cancel_matchmaking/`);
			if (response.message) {
				console.log("Unsubscribed from matchmaking:", response.message);
				this.inMatchmaking = false;
			}
		} catch (error) {
			console.error("Error unsubscribing from matchmaking:", error);
		}
	}

	async getGameInfo() {
		try {
			const response = await get(`${BASE_URL}/play/`);

			if (response.body.game) {
				const g = response.body.game;

				console.log("Game info received:", g);

				// Create a new object containing game information
				const gameInfo = {
					id: g.id,
					status: g.status,
					player1: g.player_1,
					player2: g.player_2,
					mapRound1: g.map_round_1.split(""),
					mapRound2: g.map_round_2.split(""),
					mapRound3: g.map_round_3.split(""),
					currentRound: g.current_round,
					nextToPlay: g.next_to_play,
					lastPlayTime: g.last_play_time,
					winnerRound1: g.winner_round_1,
					winnerRound2: g.winner_round_2,
					winnerRound3: g.winner_round_3,
				};

				console.log("Constructed game info object:", gameInfo);
				return gameInfo; // Return the constructed game info object
			}

			console.log("No active game found:", response.message);
			// Return null or an empty object if no game is found
			return null;
		} catch (error) {
			console.error("Error fetching game info:", error);
			// Return null or handle the error as appropriate
			return null;
		}
	}

	handleCellClick(event) {
		if (!this.inGame || this.nextToPlay !== this.myself) {
			console.log("CLICK REJECTED, NOT MY TURN");
			return;
		}

		const cell = event.target.closest(".cell"); // Ensure we get the correct cell
		if (!cell) {
			console.log("CLICK REJECTED, NOT A CELL");
			return;
		}

		const index = cell.dataset.index;

		// Ignore click if the cell is already filled
		if (this.getBoard()[index] !== "-") {
			console.log("IGNORE CLICK, ALREADY OCCUPIED");
			return;
		}

		return this.makeMove(index);
	}

	async makeMove(index) {
		try {
			const response = await post(`${BASE_URL}/make_move/`, {
				game_id: this.gameId,
				move: index,
			});
			if (response.message) {
				console.log("Make move:", response.message);
			}
		} catch (error) {
			console.error("Error making move:", error);
		}
	}

	checkWinner() {
		const winningCombinations = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for (const combo of winningCombinations) {
			const [a, b, c] = combo;
			if (
				this.board[a] &&
				this.board[a] === this.board[b] &&
				this.board[a] === this.board[c]
			) {
				this.winner = this.board[a] === "X" ? "A" : "B";
				return;
			}
		}

		// Check for draw
		if (!this.board.includes(null)) {
			this.winner = "Draw";
		}
	}
}

// Define the custom element
customElements.define("tictactoe-page", TicTacToePage);
