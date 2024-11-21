import { Component } from "../Component.js";

export class AIGamePage extends Component {
  authenticated = false; // Set this based on user session/auth status

  constructor() {
    super();
  }

  async connectedCallback() {
    console.log("GamePage connected to the DOM");
  
    try {
      await import ("../Component.js");
      await import("../navbar/Navbar.js");
      await import("./AIGameContent.js"); 
      super.connectedCallback();
  
      this.render();
  
    } catch (error) {
      console.error("Error in connectedCallback import:", error);
    }
  }
  
  render() {
    // Conditionally render the page content based on authentication status
    this.innerHTML = this.authenticated
      ? `
        <navbar-component nav-active="game"></navbar-component>
        <p class="text-center mt-5">Please sign in to play the game.</p>
      `
      : `
        <navbar-component nav-active="game"></navbar-component>
        <div class="game-container">
          <game-content-component></game-content-component>
        </div>
      `;
  }
  }

// Register the custom GamePage component
customElements.define("ai-game-page", AIGamePage);













// import { Component } from "./components/Component.js";
// export class GamePage extends Component {
//   authenticated = false;

//   constructor() {
//     super();
//   }

//   async connectedCallback() {
//     console.log("GamePage connected to the DOM");
  
//     try {
//       await import ("./components/Component.js");
//       await import("./components/navbar/Navbar.js");
//       await import("./components/local/GameContent.js");
//       super.connectedCallback();
  
//       this.render();
  
//     } catch (error) {
//       console.error("Error in connectedCallback import:", error);
//     }
//   }
  
//   render() {
//     // Conditionally render the page content based on authentication status
//     this.innerHTML = !this.authenticated
//       ? `
//         <navbar-component nav-active="game"></navbar-component>
//         <div class="game-container">
//           <start-game-button></start-game-button>
//           <end-game-button></end-game-button>
//           <game-content-component></game-content-component>
//         </div>
//       `
//       : `
//         <navbar-component nav-active="game"></navbar-component>
//         <p>Please sign in to play the game.</p>
//       `;
//   }

// }

// // Register the custom GamePage component
// customElements.define("game-page", GamePage);

