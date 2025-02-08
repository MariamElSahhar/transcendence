import { Component } from "../Component.js";
import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";
import { Engine } from "./Engine.js";
import { getUserSessionData } from "../../scripts/utils/session-manager.js";
// import { matchMaker } from "../../scripts/clients/user-clients.js";
import { matchMaker, removeMatchMaking } from "../../scripts/clients/gamelog-client.js";
import { initializeWebSocket, sendWebSocketMessage, closeWebSocket } from '../../scripts/utils/websocket-manager.js';
import { KeyHandler } from "../game-utils/KeyHandler.js";
const backendURL = "http://127.0.0.1:8000";
export class RemoteGamePage extends Component {
	constructor() {
		super();
		this.container = null;
		this.engine = null;
		this.overlay = null;
		this.playerNames = []; // Stores player names
		this.scores = [0, 0]; // Tracks scores for both players
		this.isAIEnabled = false;
		this.playerSet = false;
	}

	blockWait(ms) {
		const start = Date.now();
		while (Date.now() - start < ms) {
		  // Do nothing, just block the thread
		}
	  }
	updateLoaders(data) {

		clearTimeout(window.timeoutID);
		const status = document.getElementById("statusmsg");
		const searchBox = document.getElementById("searchBox");

		// Set the new message
		searchBox.querySelector(".heading").innerHTML = "We have found your match!";
		status.innerHTML = "";
		searchBox.style.background = "linear-gradient(65deg, 	#409edb, 	#409edb 46%, white 48%, white 47%, #e55d82 , #e55d82 30%)";
		searchBox.querySelector(".circle").style.display = "none";
		searchBox.querySelector(".bi-person").style.display = "none";
		// Update the display for ME vs USER
		const vsElement = document.createElement("div");
		vsElement.classList.add("vs-container", "d-flex", "align-items-center", "justify-content-center", "gap-3");

		const player1Element = document.createElement("div");
		player1Element.classList.add("player-container", "d-flex");
		player1Element.innerHTML = `
			<img src="${sessionStorage.getItem("avatar")}/" alt="Player 1 Avatar" class="avatar" />
			<span class="username">You</span>
		`;

		// Player 2 (Opponent's avatar and username)
		const player2Element = document.createElement("div");
		player2Element.classList.add("player-container");
		player2Element.innerHTML = `
		<img src="${backendURL}${data["avatar"]}/" alt="Player 2 Avatar" class="avatar" />
		<span class="username">${data["player"]}</span>
		`;

		// Append the player elements to the VS container
		vsElement.appendChild(player1Element);
		vsElement.innerHTML += `<span class="vs fs-3 fw-bold" style="z-index:2">VS</span>`; // Add "VS" text in between
		vsElement.appendChild(player2Element);



		// Append the VS container to the searchBox
		searchBox.appendChild(vsElement);
		document.querySelector(".loader").classList.remove("loader")
		if(data["position"] == "left")
			{
				this.playerSide = "right"
				this.playerNames.push(data["player"] || "Player 2");
				this.playerNames.push(getUserSessionData().username || "player 1");
			}
			else
			{
				this.playerSide = "left"
				this.playerNames.push(getUserSessionData().username || "player 1");
				this.playerNames.push(data["player"] || "Player 2");
			}
			// console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
		// this.blockWait(20000);
	}

	onWebSocketOpen(socket) {
	   console.log('WebSocket connected');
   }

	onWebSocketMessage(data) {
		// console.log(Date.now())
	//    console.log('Received data:', data);
	   if (data["message"] === "Match found!" && !this.playerSet) {
			this.playerSide = data["position"]
			this.gameID=data["game_session_id"]
		   this.playerSet = true;
		   this.updateLoaders(data);
		   sendWebSocketMessage({ action: "ready" , gameSession:this.gameID});
			// console.log(this.playerSide)
		   if (WebGL.isWebGLAvailable()) {
			   this.createOverlay();

			   document.getElementById("searchdiv").classList.remove("d-flex");
			   document.getElementById("searchdiv").classList.add("d-none");
			   this.container.style.display = "block";

		   } else {
			   console.error("WebGL not supported:", WebGL.getWebGLErrorMessage());
		   }
	   }
	   else if(data["message"] == "Move slab")
	   {
		const event = {"key":data["key"]}

				if(data["keytype"] == "keydown")
					this.engine.keyHookHandler.handleKeyPress(event)
				else if(data["keytype"] == "keyup")
					this.engine.keyHookHandler.handleKeyRelease(event)
	   }
	   else if(data["message"] == "Move ball")
	   {
		this.engine.scene.match.ball.setMovement(data["position"])
	   }
	   else if(data["message"] == "Update positions")
	   {
			// if(data["right"] == true && this.engine.scene.match.players[1].paddle.getPosition()!=data["position"])
			// {
				// console.log(data)
				if(this.playerSide=="right")
				{
				this.engine.scene.match.ball.setPosition(data["ball"])
				this.engine.scene.match.players[0].paddle.setPosition(data["leftpaddle"])
				this.engine.scene.match.players[1].paddle.setPosition(data["rightpaddle"])
				}
				// }
			// 	else if(data["right"] == false &&  this.engine.scene.match.players[0].paddle.getPosition()!=data["position"]){
			// this.engine.scene.match.players[0].paddle.setPosition(data["position"])
	// }
			// this.engine.scene.match.ball.setMovement(data["position"])
	   }
	   else if(data["message"] == "startRound")
	   {
		// console.log("ARE YOU READYYYYY")
		// console.log(data);
		if(data["round"] == 1)
		{
			const countdownStart = Date.now() / 1000 + 3;
			this.startCountdown(countdownStart);
			// console.log("here")
		}
		else
		{
			// console.log("here",data["index"])
			this.engine.scene.match.onPlayerReady(data["index"]);
		// this.startGame()
	   }
   }
   else if(data["message"] == "endgame")
   {
	// let index;
	console.log("LETS END IT HERE")
	if(!this.engine.scene.match.isHost)
		this.engine.scene.match.playerMarkedPoint(data["index"])
	// 	index = 1;
	// else
	// 	index = 0;
   }
}

	onWebSocketClose() {
	   console.log('WebSocket closed');
   }

	onWebSocketError(error) {
	   console.error('WebSocket error:', error);
   }
	connectedCallback() {
		// this.socket = new WebSocket(`ws://${window.location.host}:8000/ws/game/`);
		// this.keyHandler = new KeyHandler(this);


		initializeWebSocket(
			`ws://${window.location.host}:8000/ws/game/`,
			this.onWebSocketOpen.bind(this),
			this.onWebSocketMessage.bind(this),
			this.onWebSocketClose.bind(this),
			this.onWebSocketError.bind(this)
		);


		this.innerHTML = `
		<style>
			.loader {
			width: 80px; /* Increase loader size */
			height: 80px;
			}
			.match-container {
				display: flex;
				align-items: center; /* Vertically aligns the items */
				justify-content: center; /* Centers the content horizontally */
			}

			.avatar-container {
				display: flex;
				flex-direction: column; /* Arranges the avatar and username vertically */
				align-items: center; /* Centers the avatar and username */
				margin: 10px; /* Adds space between avatars */
			}

			.avatar {
				width: 50px; /* Set the size of the avatar */
				height: 50px; /* Ensure it's circular */
				border-radius: 50%; /* Makes the avatar a circle */
				object-fit: cover; /* Ensures the image covers the circle */
			}


			.player-container {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 100%; /* Ensure equal height */
			}

			.username {
				margin-top: 5px; /* Adds space between avatar and username */
				font-size: 14px;
				text-align: center;
				min-width: 100px; /* Set a minimum width for the username */
			}

			.circle {
			width: 80px; /* Increase loader size */
			height: 80px;
			border: 5px solid gray;
			border-radius: 50%;
			box-sizing: border-box;
			animation: pulse 1s linear infinite;
			}

			.circle:after {
			width: 80px; /* Increase loader size */
			height: 80px;
			border: 5px solid gray;
			border-radius: 50%;
			box-sizing: border-box;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			animation: scaleUp 1s linear infinite;
			}

			.emoji i {
				font-size: 36px;/* Set the size of the emoji */
				color: #000; /* Color of the emoji */
			}

			@keyframes scaleUp {
			0% {
				transform: translate(-50%, -50%) scale(0);
			}
			60%,
			100% {
				transform: translate(-50%, -50%) scale(1);
			}
			}

			@keyframes pulse {
			0%,
			60%,
			100% {
				transform: scale(1);
			}
			80% {
				transform: scale(1.2);
			}
			}
		</style>

<div class="d-flex justify-content-center align-items-center" id="searchdiv" style="height: 75vh;">
	<div id="searchBox" class="p-4 border rounded bg-light text-center shadow position-relative d-flex flex-column justify-content-center" style="width: 500px; height: 250px;">
		<!-- Close button -->
		<p class="position-absolute top-0 end-0 p-2 text-decoration-none text-dark m-3" id="closebtn" style="font-size: 1.5rem;cursor: pointer;">
			&times;
		</p>

		<h4 class="mb-3 heading" style="z-index:3">Searching for your opponent!</h4>
		<div class="loader position-relative d-inline-block mx-auto mb-3">
			<div class="circle position-absolute top-0 left-0 rounded-circle"></div>
			<div class="emoji position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
				<i class="bi bi-person"></i>
			</div>
		</div>
		<p class="mb-0" id="statusmsg">First to 5 points wins the game!</p>
	</div>
</div>

<div id="container" class="m-2 position-relative" style="display:none;"></div>
`;
this.container = this.querySelector("#container");
this.postRender();
	}

	postRender() {
		super.addComponentEventListener(
			this.querySelector("#closebtn"),
			"click",
			() => {
				window.redirect("/home");
			}
		);
		this.waitForOpponent();

			}
		async removeFromMatchmaking()
		{
			const {status, success, data } = await removeMatchMaking();
			console.log(status,success,data);
		}

			async waitForOpponent() {
				window.timeoutID=setTimeout(() => {
					const stat = document.getElementById("statusmsg");
					const searchBox = document.getElementById("searchBox");
					searchBox.querySelector(".heading").innerHTML = "We're sorry! :(";
					stat.innerHTML = "No opponent found. Please try again later!";
					searchBox.querySelector(".circle").style.display = "none";
					this.removeFromMatchmaking();
					// return;
				}, 180000); // 3 minutes in milliseconds
				// if(flag == 0)
				// {
				const {status, success, data } = await matchMaker();
				if(status == 400)
				{
					const status = document.getElementById("statusmsg");
					const searchBox = document.getElementById("searchBox");
					searchBox.querySelector(".heading").innerHTML = "You're already in the queue!";
					status.innerHTML = "";
					return;
				}
			}

			startGame() {
				this.engine = new Engine(this, this.isAIEnabled, this.playerNames, this.playerSide,this.gameID);
				this.engine.startGame();
				this.removeOverlay();
			}

			updateScore(playerIndex) {
				if (playerIndex < this.scores.length) {
					this.scores[playerIndex] += 1;
					console.log(
						`Player ${playerIndex} scored! Current score: ${this.scores[playerIndex]}`
					);
				} else {
					console.error("Invalid player index:", playerIndex);
				}
			}

			startCountdown(startDateInSeconds) {
				let secondsLeft = Math.round(startDateInSeconds - Date.now() / 1000);
				this.updateOverlayCountdown(secondsLeft);

				const countDownInterval = setInterval(() => {
					secondsLeft -= 1;
					this.updateOverlayCountdown(secondsLeft);

					if (secondsLeft <= 0) {
						clearInterval(countDownInterval);
						this.startGame();
					}
				}, 1000);
			}

			createOverlay() {
				this.overlay = document.createElement("div");
				this.overlay.id = "game-overlay";
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
					<h1 id="countdown" class="display-1 fw-bold">5</h1>
					<p class="card-text">Get ready! The game will start soon.</p>
					</div>
					</div>
					`;
					this.container.appendChild(this.overlay);
				}

			updateOverlayCountdown(secondsLeft) {
				const countdownElement = this.overlay.querySelector("#countdown");
				if (countdownElement) {
					countdownElement.textContent = secondsLeft;
				}
			}

			removeOverlay() {
				if (this.overlay) {
					this.overlay.remove();
					this.overlay = null;
				}
			}

			addEndGameCard(playerScore, opponentScore) {
				const playerName = this.playerNames[0];
				const opponentName = this.playerNames[1];

				this.createOverlay();
				this.overlay.innerHTML = `
				<div id="end-game-card" class="card text-center text-dark bg-light" style="max-width: 24rem;">
				  <div class="card-header">
					<h1 class="card-title text-success">Game Over</h1>
				  </div>
				  <div class="card-body">
					<h5 class="card-subtitle mb-3 text-muted">Final Score</h5>
					<div class="d-flex justify-content-center align-items-center mb-4">
					  <div class="text-center me-3">
						<h6 class="fw-bold text-truncate" style="max-width: 100px;">${playerName}</h6>
						<p class="display-6 fw-bold">${playerScore}</p>
						</div>
						<div class="px-3 display-6 fw-bold align-self-center">:</div>
					  <div class="text-center ms-3">
					  <h6 class="fw-bold text-truncate" style="max-width: 100px;">${opponentName}</h6>
					  <p class="display-6 fw-bold">${opponentScore}</p>
					  </div>
					  </div>
					<button class="btn btn-primary mt-3" onclick="window.location.href='/home'">Go Home</button>
					</div>
					</div>
					`;
				}
		}
customElements.define("remote-game-page", RemoteGamePage);
