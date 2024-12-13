
import { Component } from "../Component.js";

export class TournamentPage extends Component {
    authenticated = false;

    constructor() {
        super();
    }

    async connectedCallback() {
        console.log("TournamentPage connected to the DOM");
    
        try {
            await import("./TournamentContent.js");
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
                <navbar-component nav-active="tournament"></navbar-component>
                <div class="tournament-container">
                    <tournament-content-component></tournament-content-component>
                </div>
              `
            : `
                <navbar-component nav-active="tournament"></navbar-component>
                <p>Please sign in to participate in the tournament.</p>
              `;
    }

}

// Register the custom TournamentPage component
customElements.define("tournament-page", TournamentPage);