import { Component } from "../Component.js";
import { get, post } from "../../scripts/utils/http-requests.js";
import {
	isAuth,
	getUserSessionData,
} from "../../../scripts/utils/session-manager.js";

import {
	renderEndGameCard,
	renderWaitingForOpponent,
	removeOverlay,
} from "../pong/Overlays.js";
import { showError } from "../error/ErrorPage.js";

const BASE_URL = `/api/tictactoe`;

function truncateName(name) {
	return name.length > 6 ? name.substring(0, 5) + ".." : name;
}

class TicTacToePage extends Component {
	constructor() {
		super();
		this.myself = getUserSessionData().username;
		this.inGame = false;
		this.inMatchmaking = false;
		this.isFinished = false;
		this.gameInfoGetIntervalFd = null;
		this.waitingForOpponentOverlay = null;

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

		this.checkAuthInterval = setInterval(async () => {
			if (!(await isAuth())) window.redirect("/");
		}, 30000);
	}

	applyGameInfo(gameInfo) {
		const lastStatus = this.inGame
			? "PLAYING"
			: this.inMatchmaking
			? "MATCHMAKING"
			: this.isFinished
			? "FINISHED"
			: "NONE";
		const previousLastPlay = this.lastPlayTime;

		if (
			gameInfo &&
			(gameInfo.status === "PLAYING" || gameInfo.status === "FINISHED")
		) {
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

			if (previousLastPlay != this.lastPlayTime) {
				this.startTimer(60 - (Date.now() - this.lastPlayTime) / 1000); // the time management
			}

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

			if (gameInfo.status === "PLAYING") {
				if (lastStatus !== "PLAYING") {
					this.inGame = true;

					if (this.waitingForOpponentOverlay !== null) {
						removeOverlay(this.waitingForOpponentOverlay);
						this.waitingForOpponentOverlay = null;
					}
				}

				if (
					lastStatus !== "PLAYING" ||
					previousLastPlay !== this.lastPlayTime
				) {
					this.menuActivation(false);
					this.refreshScoresHtml();
					this.refreshBoardWrapperHtml();
				}
			} else {
				if (lastStatus !== "FINISHED") {
					this.isFinished = true;
					this.inMatchmaking = false;
					this.inGame = false;
					this.menuActivation(true);
					this.refreshScoresHtml();
					this.refreshBoardWrapperHtml();

					if (lastStatus !== "NONE" && lastStatus !== "MATCHMAKING")
						renderEndGameCard(
							this,
							[this.player1, this.player2],
							[this.scoreA, this.scoreB],
							false
						);
				}
			}
			return;
		}

		if (gameInfo && gameInfo.status === "MATCHMAKING") {
			this.inMatchmaking = true;
			this.gameId = gameInfo.id;
			this.status = gameInfo.status;
			this.player1 = gameInfo.player1;
			this.player2 = gameInfo.player2 ?? "mario";
			this.mapRound1 = [];
			this.mapRound2 = [];
			this.mapRound3 = [];
			this.currentRound = 0;
			this.nextToPlay = "";
			this.lastPlayTime = 0;
			this.winnerRound1 = "";
			this.winnerRound2 = "";
			this.winnerRound3 = "";
			this.scoreA = 0;
			this.scoreB = 0;

			if (lastStatus !== "MATCHMAKING") {
				this.menuActivation(true);
				this.waitingForOpponentOverlay = renderWaitingForOpponent(
					this,
					this.handlePlayBtnClick.bind(this)
				);
				this.refreshScoresHtml();
				this.refreshBoardWrapperHtml();
			}
			return;
		}

		if (lastStatus !== "NONE") {
			this.menuActivation(true);
			this.refreshScoresHtml();
			this.refreshBoardWrapperHtml();
		}

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

	async connectedCallback() {
		super.connectedCallback();

		window.addEventListener("beforeunload", (event) => {
			this.disconnectedCallback();
		});

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
							? `<img src="/assets/sprites/plant.webp" alt="X" />`
							: cell === "O"
							? `<img src="/assets/sprites/shroom.webp" alt="O" />`
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
            <div class="player1 player-score-container">
                <img class="star ${
					this.player1 === this.nextToPlay ? "" : "hidden-opacity"
				}" src="/assets/sprites/star.webp" alt="X" />

                <div class="score-wrapper">
                    <span class="score">${this.scoreA}</span>
                    <img class="shroom" src="/assets/sprites/plant.webp" alt="X" />
                </div>

                <div class="player-name text-truncate" data-player="${
					this.player1
				}">
                    ${truncateName(this.player1)}
                </div>
            </div>

            <div class="player2 player-score-container">
                <img class="star ${
					this.player2 === this.nextToPlay ? "" : "hidden-opacity"
				}" src="/assets/sprites/star.webp" alt="X" />

                <div class="score-wrapper">
                    <span class="score">${this.scoreB}</span>
                    <img class="shroom" src="/assets/sprites/shroom.webp" alt="X" />
                </div>

                <div class="player-name text-truncate" data-player="${
					this.player2
				}">
                    ${truncateName(this.player2)}
                </div>

            </div>
         `;
	}

	render() {
		return `
			<div class="container">
				<div class="tictactoe d-flex flex-column align-content-center align-items-center relative menu-activated">
					<img class="title-img" src="/assets/title.webp" alt="X"/>

					<div class="position-relative z-3 d-flex align-content-center align-items-center">
						<div class="board-wrapper">
							${this.getBoardWrapperHtml()}
						</div>

						<div class="play-btn">Play</div>
					</div>

					<div class="scores">
						${this.getScoresHtml()}
					</div>
					<div id="timer" class="fs-1 hidden">03:00</div>
				</div>
			</div>
        `;
	}

	style() {
		return `
            <style>
				#winner-sprite {
					height: 56px;
					width: auto;
				}
				.icon {
					width: auto;
					height: 30px;
				}

                .container {
                    background-color: transparent;

                    .play-btn {
                        display: none;
                        position: absolute;
                        margin-left: calc(50% - 3em);
                        width: 6em;
                        height: 2em;
                        background-color: var(--mario-red-color);
                        z-index: 6;
                        color: white;
                        font-family: 'New Super Mario Font U', sans-serif;
                        font-size: 1.5em;
                        border: 0.2em solid white;
                    }

                    .title-img {
                        margin-top: 3em;
                        background-color: transparent;
                        width: 20em;
                        height: 5em;
                        z-index: 2;
                    }

                    .scores {
                        margin-top: 2em;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                        max-width: 100%;
                        padding-left: 1em;
                        padding-right: 1em;
                        -webkit-text-stroke: 0.1em #000000;
                        color: #ebebeb;
                        bottom: 0.5em;
                        z-index: 2;

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

                        .player-score-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;

                            .score-wrapper {
                                display: flex;
                                align-items: center;
                                justify-content: center;

                                .score {
                                    font-size: 5em;
                                    margin-right: 0.2em;
                                    font-family: 'New Super Mario Font U', sans-serif;
                                }

                                .shroom {
                                    width: 5em;
                                    height: 5em;
                                }
                            }

                            .star {
                                width: 3em;
                                height: 3em;
                            }

                            .player-name {
                                font-size: 2.5em;
                                position: relative;
                                bottom: 0.5em;
                                font-family: 'New Super Mario Font U', sans-serif;
                            }
                        }
                    }

                    .board-wrapper {
                        position: relative;
                        z-index: 4;

                        .board {
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            grid-template-rows: repeat(3, 1fr);
                            gap: 0.7em;
                            width: 20em;
                            height: 20em;
                            z-index: 3;
                            position: relative;

                            .cell {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                background: url('/assets/cube.webp');  /* Use your pixelated webp */
                                background-size: cover;   /* Make sure it covers the whole cell */
                                background-position: center;  /* Center the image */
                                cursor: pointer;
                                padding: 0.2em;
                                font-size: 3em;
                                position: relative;
                                image-rendering: pixelated;  /* Apply pixelation effect */
                                z-index: 2;
                            }
                        }
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
                }

                img {
                    width: 90%;
                    height: 90%;
                    image-rendering: pixelated;
                }

				.hidden {
					display: none;
				}

                .hidden-opacity {
                    opacity: 0;
                }

                .pipes-container {
                    opacity: 0;
                }

                @media (min-width: 900px) {
                    .container {
                        font-size: 1.2em;
                    }
				}

                @media (min-width: 1400px) {
                    .container {
                        font-size: 1.4em;
                    }
				}

                @media (min-width: 1400px) or (max-height: 1000px and min-width: 1200px) {
                    .container {
                        .scores {
                            position: absolute;
                            padding-left: 8em;
                            padding-right: 8em;
                            bottom: 20%;
                            max-width: 80em;
                        }
                    }
				}

                @media (min-width: 1200px) and (min-height: 1200px) {
                    .pipes-container {
                        opacity: 1;
                    }
                }

				#timer {
					z-index: 4;
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

		this.container = document.querySelector(".container");
	}

	startTimer(remainingTimeInSec) {
		const timerElement = document.getElementById("timer");
		let timeLeft = remainingTimeInSec;

		if (timeLeft < 30) {
			timerElement.classList.remove("hidden");
		} else {
			timerElement.classList.add("hidden");
		}

		clearInterval(this.timerInterval);

		if (this.status != "PLAYING") {
			timerElement.innerHTML = "";
			return;
		}

		const updateTimer = () => {
			const minutes = Math.floor(timeLeft / 60);
			const seconds = Math.floor(timeLeft % 60);

			if (timeLeft < 30) {
				timerElement.classList.remove("hidden");
			} else {
				timerElement.classList.add("hidden");
			}
			timerElement.innerHTML = `${minutes
				.toString()
				.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
			if (timeLeft <= 0) {
				clearInterval(this.timerInterval);
				timerElement.innerHTML = "00:00";
				this.timeOutManager();
			} else {
				timeLeft--;
			}
		};

		updateTimer();
		this.timerInterval = setInterval(updateTimer, 1000);
	}

	async subscribeToGameInfo() {
		if (this.gameInfoGetIntervalFd !== null) {
			return;
		}

		this.gameInfoGetIntervalFd = setInterval(async () => {
			const game = await this.getGameInfo();

			if (game === false) return;

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
		if (this.inMatchmaking) {
			this.cancelMatchmaking();
		}

		clearInterval(this.checkAuthInterval);
		this.unsubscribeToGameInfo();
		super.disconnectedCallback();
	}

	async joinMatchmaking() {
		try {
			const response = await post(`${BASE_URL}/join_matchmaking/`);
			if (response.message) {
				this.inMatchmaking = true;
			}
		} catch (error) {
			showError();
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
				this.inMatchmaking = false;
			}
		} catch (error) {
			showError();
			console.error("Error unsubscribing from matchmaking:", error);
		}
	}

	async getGameInfo() {
		try {
			const response = await get(`${BASE_URL}/play/`);

			if (response.body?.game) {
				const g = response.body.game;

				const gameInfo = {
					id: g.id,
					status: g.status,
					player1: g.player_1,
					player2: g.player_2,
					mapRound1: (g.map_round_1 ?? "").split(""),
					mapRound2: (g.map_round_2 ?? "").split(""),
					mapRound3: (g.map_round_3 ?? "").split(""),
					currentRound: g.current_round,
					nextToPlay: g.next_to_play,
					lastPlayTime: new Date(g.last_play_time).getTime(),
					winnerRound1: g.winner_round_1,
					winnerRound2: g.winner_round_2,
					winnerRound3: g.winner_round_3,
				};

				return gameInfo;
			}

			return null;
		} catch (error) {
			showError();
			console.error("Error fetching game info:", error);
			return false;
		}
	}

	handleCellClick(event) {
		if (!this.inGame || this.nextToPlay !== this.myself) {
			return;
		}

		const cell = event.target.closest(".cell");
		if (!cell) {
			return;
		}

		const index = cell.dataset.index;

		if (this.getBoard()[index] !== "-") {
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
			}
		} catch (error) {
			showError();
			console.error("Error making move:", error);
		}
	}

	async timeOutManager() {
		try {
			const response = await post(`${BASE_URL}/timeout_game/`, {
				game_id: this.gameId,
			});
		} catch (error) {}
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

		if (!this.board.includes(null)) {
			this.winner = "Draw";
		}
	}
}

customElements.define("tictactoe-page", TicTacToePage);
