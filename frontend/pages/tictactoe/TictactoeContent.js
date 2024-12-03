import { Component } from "../Component.js";
const BASE_URL = "http://127.0.0.1:8000";
import { get, post, patch, del } from "../../js/utils/http-requests.js";

class TicTacToeContent extends Component {
	constructor() {
		super();
		this.board = Array(9).fill(null); // 3x3 board initialized to null
		this.currentPlayer = "A"; // Starting player
		this.winner = null; // Winner status
		this.scoreA = 0;
		this.scoreB = 0;
		this.inGame = false;
		this.inMatchmaking = false;
	}

	connectedCallback() {
		super.connectedCallback();
	}

	render() {
		// Render the score and current player
		const status = this.winner
			? this.winner === "Draw"
				? "It's a Draw!"
				: `Winner: Player ${this.winner}`
			: `Player ${this.currentPlayer} to play`;

		// Render the board
		let boardHTML = '<div class="board">';
		this.board.forEach((cell, index) => {
			boardHTML += `
				<div class="cell" data-index="${index}">
					${cell === "X" ? `<img src="./pages/tictactoe/plant.png" alt="X" />` : cell === "O" ? `<img src="./pages/tictactoe/shroom.png" alt="O" />` : ""}
				</div>
			`;
		});

		boardHTML += "</div>";

		return `
			<div class="tictactoe ${this.inGame ? "": "menu-activated"}">
				<div class="sky"></div>
				<img class="title-img" src="./pages/tictactoe/title.png" alt="X" />

				<div class="board-wrapper">
					${boardHTML}

					<div class="play-btn">PLAY</div>
				</div>

				<div class="scores">
					<div class="player1">
						<span class="score">${this.scoreA}</span>
						<img src="./pages/tictactoe/plant.png" alt="X" />
					</div>

					<div class="player2">
						<span class="score">${this.scoreB}</span>
						<img src="./pages/tictactoe/shroom.png" alt="X" />
					</div>
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
					background: url(./pages/tictactoe/sky.png);
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
					justify-content: space-between; /* Positions scores on each side of the board */
					align-items: center; /* Ensures vertical alignment */
					width: 60%; /* Makes the score section narrower and closer to the board */
					margin: 0 auto; /* Centers the score section horizontally */
					padding: 0; /* Removes unnecessary padding */
					-webkit-text-stroke: 5px #000000;
					font-family: 'New Super Mario Font U', sans-serif;
					font-size: 10em;
					color: #ebebeb;
					position: relative;
					bottom: 1.2em;
					z-index: 2;
				}

				.player1 {
					span {
						color: #43b133
					}

					img {
						width: 0.7em;
						height: 0.7em;
					}
				}

				.player2 {
					span {
						color: #e71f07
					}
					
					img {
						width: 0.7em;
						height: 0.7em;
					}
				}
				
				.floor {
				    width: 100%;
					height: 10em;
					display: flex;
					background: url(./pages/tictactoe/floor.png);
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
					background: url('./pages/tictactoe/cube.png');  /* Use your pixelated PNG */
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
			this.addComponentEventListener(cell, "click", this.handleCellClick, this);
		});

		const playBtn = this.querySelector(".play-btn");

		this.addComponentEventListener(playBtn, "click", this.handlePlayBtnClick, this);
	}

	async handlePlayBtnClick(event) {
		if (this.inMatchmaking) {
			// cancel matchmaking
		}

		// subscribe to matchmaking
		console.log('START MATCHMAKING');
		
		const ret = await post(`${BASE_URL}/play/`);

		console.log('RETURN', ret);

		console.log('MATCHMAKING STARTED');

		this.inMatchmaking = true;
	}

	handleCellClick(event) {
		if (!this.inGame) return;

		const cell = event.target.closest(".cell"); // Ensure we get the correct cell
		if (!cell) return;

		const index = cell.dataset.index;

		// Ignore click if the cell is already filled or if there's a winner
		if (this.board[index] || this.winner) {
			return;
		}

		// Update the board with the current player's symbol
		this.board[index] = this.currentPlayer === "A" ? "X" : "O";

		// Update the cell's innerHTML with the correct symbol (image for X or O)
		cell.innerHTML =
			this.board[index] === "X"
				? `<img src="https://static.vecteezy.com/system/resources/previews/041/638/510/non_2x/ai-generated-pixelation-of-red-heart-in-image-free-png.png" alt="X" />`
				: `<img src="https://cdn.pixabay.com/photo/2023/03/11/07/07/emoji-7843852_1280.png" alt="O" />`;

		// Check for winner
		this.checkWinner();

		// Update scores if there's a winner
		if (this.winner === "X") {
			this.scoreA++;
		} else if (this.winner === "O") {
			this.scoreB++;
		}

		// Switch player
		if (!this.winner) {
			this.currentPlayer = this.currentPlayer === "A" ? "B" : "A";
		}

		// Re-render the component
		this.update();
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
			if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
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
customElements.define("tic-tac-toe-content", TicTacToeContent);