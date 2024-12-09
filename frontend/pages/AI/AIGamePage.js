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
        <p class="text-center mt-5">Please sign in to play the game.</p>
      `
      : `
        <div class="game-container">
          <game-content-component></game-content-component>
        </div>
      `;
  }
  }

customElements.define("ai-game-page", AIGamePage);

