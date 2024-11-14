import { Component } from "../Component.js";
import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";
import { Engine } from "./Engine.js";
import { Theme } from "../utils/Theme.js";
import { getUserSessionData } from "../../js/utils/session-manager.js";

export class GameContent extends Component {
    constructor() {
        super();
        this.container = null;
        this.engine = null;
        this.overlay = null;
        this.players = [];  // Stores player names
        this.scores = [0, 0];  // Tracks scores for both players
    }

    connectedCallback() {
        const userData = getUserSessionData();
        const firstPlayerName = userData.username || "Player 1";
        this.players.push(firstPlayerName);

        this.innerHTML = `
            <navbar-component></navbar-component>
            <div id="player-setup" class="p-3 border rounded bg-light" style="max-width: 400px; margin: 40px auto 0;">
              <h3 class="text-center">Setup Players</h3>
              <form id="player-form">
                <div id="player-names">
                  <div class="mb-3">
                    <label for="player2-name" class="form-label text-center d-block">PLEASE ENTER PLAYER'S NAME:</label>
                    <input type="text" id="player2-name" name="player2-name" class="form-control" required />
                  </div>
                </div>
                <button type="submit" class="btn btn-primary mt-3 w-100">Start Game</button>
              </form>
            </div>
            <div id="container" class="m-2 position-relative" style="display:none;"></div>
        `;
        
        this.container = this.querySelector("#container");
        this.setupPlayerForm();
    }

    setupPlayerForm() {
        const form = this.querySelector("#player-form");

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.players = [this.players[0]];

            const player2Name = form.querySelector("#player2-name").value;
            this.players.push(player2Name || "Player 2");

            this.querySelector("#player-setup").style.display = "none";
            this.container.style.display = "block";

            this.postRender();
        });
    }

    postRender() {
        this.addComponentEventListener(document, Theme.event, this.themeEvent.bind(this));

        if (WebGL.isWebGLAvailable()) {
            this.createOverlay();
            const countdownStart = Date.now() / 1000 + 5;
            this.startCountdown(countdownStart);
        } else {
            console.error("WebGL not supported:", WebGL.getWebGLErrorMessage());
        }
    }

    startGame() {
        this.engine = new Engine(this);
        this.engine.startGame();
        this.removeOverlay();
    }

    updateScore(playerIndex) {
      if (playerIndex < this.scores.length) {
          this.scores[playerIndex] += 1;
          console.log(`Player ${playerIndex} scored! Current score: ${this.scores[playerIndex]}`);
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
            "position-fixed", "top-0", "start-0", "w-100", "h-100",
            "d-flex", "justify-content-center", "align-items-center",
            "bg-dark", "bg-opacity-75", "text-white"
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
      const playerName = this.players[0];
      const opponentName = this.players[1];
  
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
            <button class="btn btn-primary mt-3" onclick="window.location.href='/'">Go Home</button>
          </div>
        </div>
      `;
  }

    themeEvent() {
        if (Theme.get() === "light") {
            this.engine?.scene?.setLightTheme();
        } else {
            this.engine?.scene?.setDarkTheme();
        }
    }

    endGame() {
        this.addEndGameCard(); // Display the final score when the game ends
    }
}

customElements.define("game-content-component", GameContent);

//SECOND  FORM THAT  DISPLAY THE NAMES FOR ONLY TWO PLAYERS WIHOUT CREATING THE FORM


// import { Component } from "../Component.js";
// import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";
// import { Engine } from "./Engine.js";
// import { Theme } from "../../utils/Theme.js";
// import { getUserSessionData } from "../../../js/utils/session-manager.js"; // Import getUserSessionData

// export class GameContent extends Component {
//     constructor() {
//         super();
//         this.container = null;
//         this.engine = null;
//         this.overlay = null;
//     }

//     connectedCallback() {
//         // Render the main game container
//         this.innerHTML = `  
//           <navbar-component></navbar-component>
//           <div id="container" class="m-2 position-relative"></div>
//         `;
//         this.container = this.querySelector("#container");
//         if (!this.container) {
//             console.error("Container could not be found in GameContent.");
//         }
//         this.postRender();
//     }

//     postRender() {
//         console.log("postRender called");
//         this.container = this.querySelector("#container");
//         if (!this.container) {
//             console.error("Container could not be found in GameContent.");
//         }
//         this.addComponentEventListener(document, Theme.event, this.themeEvent.bind(this));

//         if (WebGL.isWebGLAvailable()) {
//             console.log("WebGL is available, creating countdown overlay...");
//             this.createOverlay(); // Set up the overlay placeholder for the countdown
//             const countdownStart = Date.now() / 1000 + 5; // 5-second countdown
//             this.startCountdown(countdownStart);
//         } else {
//             console.error("WebGL not supported:", WebGL.getWebGLErrorMessage());
//         }
//     }

//     startGame() {
//         // Initialize and start the Engine instance
//         this.engine = new Engine(this);
//         this.engine.startGame();
//         this.removeOverlay(); // Remove the overlay once the game starts
//     }

//     startCountdown(startDateInSeconds) {
//         let secondsLeft = Math.round(startDateInSeconds - Date.now() / 1000);
//         this.updateOverlayCountdown(secondsLeft);

//         const countDownInterval = setInterval(() => {
//             secondsLeft -= 1;
//             console.log(`Countdown seconds left: ${secondsLeft}`); // Debugging log
//             this.updateOverlayCountdown(secondsLeft);

//             if (secondsLeft <= 0) {
//                 clearInterval(countDownInterval);
//                 this.startGame(); // Start the game after countdown
//             }
//         }, 1000);
//     }

//     createOverlay() {
//         // Create overlay to show countdown
//         this.overlay = document.createElement("div");
//         this.overlay.id = "game-overlay";
//         this.overlay.classList.add(
//             "position-fixed", "top-0", "start-0", "w-100", "h-100",
//             "d-flex", "justify-content-center", "align-items-center",
//             "bg-dark", "bg-opacity-75", "text-white"
//         );

//         // Set high z-index to ensure visibility and add positioning styles
//         this.overlay.style.zIndex = "9999";

//         // Add the centered card content with Bootstrap classes
//         this.overlay.innerHTML = `
//           <div class="card text-center text-dark bg-light" style="width: 18rem;">
//             <div class="card-body">
//               <h1 id="countdown" class="display-1 fw-bold">5</h1> <!-- Initial countdown display -->
//               <p class="card-text">Get ready! The game will start soon.</p>
//             </div>
//           </div>
//         `;

//         // Append the overlay to the container
//         this.container.appendChild(this.overlay);
//         console.log("Overlay with countdown card created and added to the container.");
//     }

//     updateOverlayCountdown(secondsLeft) {
//         // Update the countdown display inside the overlay
//         const countdownElement = this.overlay.querySelector("#countdown");
//         if (countdownElement) {
//             countdownElement.textContent = secondsLeft;
//             console.log(`Updating countdown display: ${secondsLeft}`); // Debugging log
//         } else {
//             console.error("Countdown element not found in overlay");
//         }
//     }

//     removeOverlay() {
//         // Remove the countdown overlay once the game starts
//         if (this.overlay) {
//             this.overlay.remove();
//             this.overlay = null;
//         }
//     }

//     addEndGameCard(playerScore, opponentScore) {
//         // Retrieve the logged-in player's data to get the player name
//         const userData = getUserSessionData();
//         const playerName = userData.username || "Player 1"; // Use the logged-in username or default to "Player 1"
//         const opponentName = "Opponent"; // Placeholder for opponent's name

//         this.createOverlay(); // Reuse the overlay to show the end game card
//         this.overlay.innerHTML = `
//           <div id="end-game-card" class="card text-center text-dark bg-light" style="max-width: 24rem;">
//             <div class="card-header">
//               <h1 class="card-title text-success">Game Over</h1>
//             </div>
//             <div class="card-body">
//               <h5 class="card-subtitle mb-3 text-muted">Final Score</h5>
//               <div class="d-flex justify-content-center align-items-center mb-4">
//                 <div class="text-center me-3">
//                   <h6 class="fw-bold text-truncate" style="max-width: 100px;">${playerName}</h6>
//                   <p class="display-6 fw-bold">${playerScore}</p>
//                 </div>
//                 <div class="px-3 display-6 fw-bold align-self-center">:</div> <!-- Separator only for scores -->
//                 <div class="text-center ms-3">
//                   <h6 class="fw-bold text-truncate" style="max-width: 100px;">${opponentName}</h6>
//                   <p class="display-6 fw-bold">${opponentScore}</p>
//                 </div>
//               </div>
//               <button class="btn btn-primary mt-3" onclick="window.location.href='/'">Go Home</button>
//             </div>
//           </div>
//         `;
//     }

//     enableGameBlur() {
//         const canvas = this.querySelector("canvas");
//         if (canvas) {
//             canvas.style.filter = "blur(5px)";
//         }
//     }

//     disableGameBlur() {
//         const canvas = this.querySelector("canvas");
//         if (canvas) {
//             canvas.style.filter = "blur(0px)";
//         }
//     }

//     themeEvent() {
//         if (Theme.get() === "light") {
//             this.engine?.scene?.setLightTheme();
//         } else {
//             this.engine?.scene?.setDarkTheme();
//         }
//     }
// }

// customElements.define("game-content-component", GameContent);











// FIRST AND ORIGINAL FORM THAT DOSE NOT DISPLAY THE NAMES

// import { Component } from "../Component.js";
// import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";
// import { Engine } from "./Engine.js";
// import { Theme } from "../../utils/Theme.js";

// export class GameContent extends Component {
//   constructor() {
//     super();
//     this.container = null;
//     this.engine = null;
//     this.overlay = null;
//   }

//   connectedCallback() {
//     this.innerHTML = `  
//       <navbar-component></navbar-component>
//       <div id="container" class="m-2 position-relative"></div>
//     `;
//     this.container = this.querySelector("#container");
//     if (!this.container) {
//       console.error("Container could not be found in GameContent.");
//     }
//     this.postRender();
//   }

//   postRender() {
//     console.log("postRender called");
//     this.container = this.querySelector("#container");
//     if (!this.container) {
//       console.error("Container could not be found in GameContent.");
//     }
//     this.addComponentEventListener(document, Theme.event, this.themeEvent.bind(this));

//     if (WebGL.isWebGLAvailable()) {
//       console.log("WebGL is available, creating countdown overlay...");
//       this.createOverlay(); // Set up the overlay placeholder for the countdown
//       const countdownStart = Date.now() / 1000 + 5; // 5-second countdown
//       this.startCountdown(countdownStart);
//     } else {
//       console.error("WebGL not supported:", WebGL.getWebGLErrorMessage());
//     }
//   }

//   startGame() {
//     // Initialize and start the Engine instance
//     this.engine = new Engine(this);
//     this.engine.startGame();
//     this.removeOverlay(); // Remove the overlay once the game starts
//   }

//   startCountdown(startDateInSeconds) {
//     let secondsLeft = Math.round(startDateInSeconds - Date.now() / 1000);
//     this.updateOverlayCountdown(secondsLeft);
    
//     const countDownInterval = setInterval(() => {
//       secondsLeft -= 1;
//       console.log(`Countdown seconds left: ${secondsLeft}`); // Debugging log
//       this.updateOverlayCountdown(secondsLeft);

//       if (secondsLeft <= 0) {
//         clearInterval(countDownInterval);
//         this.startGame(); // Start the game after countdown
//       }
//     }, 1000);
//   }
//   createOverlay() {
//     // Create overlay to show countdown
//     this.overlay = document.createElement("div");
//     this.overlay.id = "game-overlay";
//     this.overlay.classList.add(
//       "position-fixed", "top-0", "start-0", "w-100", "h-100", 
//       "d-flex", "justify-content-center", "align-items-center", 
//       "bg-dark", "bg-opacity-75", "text-white"
//     );
    
//     // Set high z-index to ensure visibility and add positioning styles
//     this.overlay.style.zIndex = "9999";

//     // Add the centered card content with Bootstrap classes
//     this.overlay.innerHTML = `
//       <div class="card text-center text-dark bg-light" style="width: 18rem;">
//         <div class="card-body">
//           <h1 id="countdown" class="display-1 fw-bold">5</h1> <!-- Initial countdown display -->
//           <p class="card-text">Get ready! The game will start soon.</p>
//         </div>
//       </div>
//     `;
    
//     // Append the overlay to the container
//     this.container.appendChild(this.overlay);
//     console.log("Overlay with countdown card created and added to the container.");
//   }

//   updateOverlayCountdown(secondsLeft) {
//     // Update the countdown display inside the overlay
//     const countdownElement = this.overlay.querySelector("#countdown");
//     if (countdownElement) {
//       countdownElement.textContent = secondsLeft;
//       console.log(`Updating countdown display: ${secondsLeft}`); // Debugging log
//     } else {
//       console.error("Countdown element not found in overlay");
//     }
//   }

//   removeOverlay() {
//     // Remove the countdown overlay once the game starts
//     if (this.overlay) {
//       this.overlay.remove();
//       this.overlay = null;
//     }
//   }

//   addEndGameCard(playerName, opponentName, playerScore, opponentScore) {
//     this.createOverlay(); // Reuse the overlay to show the end game card
//     this.overlay.innerHTML = `
//       <div id="end-game-card" class="card text-center text-dark bg-light" style="max-width: 24rem;">
//         <div class="card-header">
//           <h1 class="card-title text-success">Game Over</h1>
//         </div>
//         <div class="card-body">
//           <h5 class="card-subtitle mb-3 text-muted">Final Score</h5>
//           <div class="d-flex justify-content-center align-items-center mb-4">
//             <div class="text-center me-3">
//               <h6 class="fw-bold text-truncate" style="max-width: 100px;">${playerName}</h6>
//               <p class="display-6">${playerScore}</p>
//             </div>
//             <div class="px-3 display-6 fw-bold">:</div> <!-- Separator only for scores -->
//             <div class="text-center ms-3">
//               <h6 class="fw-bold text-truncate" style="max-width: 100px;">${opponentName}</h6>
//               <p class="display-6">${opponentScore}</p>
//             </div>
//           </div>
//           <button class="btn btn-primary mt-3" onclick="window.location.href='/'">Go Home</button>
//         </div>
//       </div>
//     `;
// }



//   enableGameBlur() {
//     const canvas = this.querySelector("canvas");
//     if (canvas) {
//       canvas.style.filter = "blur(5px)";
//     }
//   }

//   disableGameBlur() {
//     const canvas = this.querySelector("canvas");
//     if (canvas) {
//       canvas.style.filter = "blur(0px)";
//     }
//   }

//   themeEvent() {
//     if (Theme.get() === "light") {
//       this.engine?.scene?.setLightTheme();
//     } else {
//       this.engine?.scene?.setDarkTheme();
//     }
//   }
// }

// customElements.define("game-content-component", GameContent);
