import { Component } from "../Component.js";
export class GamePage extends Component {
  authenticated = false;

  constructor() {
    super();
  }

  async connectedCallback() {
    console.log("GamePage connected to the DOM");

    try {
      await import ("../Component.js");
      await import("../navbar/Navbar.js");
      await import("./GameContent.js");
      super.connectedCallback();

      this.render();

    } catch (error) {
      console.error("Error in connectedCallback import:", error);
    }
  }

  render() {
    // Conditionally render the page content based on authentication status
    this.innerHTML = !this.authenticated
      ? `
        <navbar-component nav-active="game"></navbar-component>
        <div class="game-container">
          <start-game-button></start-game-button>
          <end-game-button></end-game-button>
          <game-content-component></game-content-component>
        </div>
      `
      : `
        <navbar-component nav-active="game"></navbar-component>
        <p>Please sign in to play the game.</p>
      `;
  }

}

// Register the custom GamePage component
customElements.define("game-page", GamePage);

