import { Component } from "./Component.js";

export class LandingPage extends Component {
	constructor() {
		super();
	}

	render() {
		return `
			<div class="landing-page">
				<!-- Sky Section -->
				<div class="sky"></div>

				<!-- Main Content Section -->
				<div class="d-flex flex-column justify-content-center align-items-center h-full min-h-full w-100 gap-2">
					<h1>Welcome to Pong</h1>
					<button class="btn btn-primary w-25" onclick="window.redirect('/login')">Log In</button>
					<button class="btn btn-primary w-25" onclick="window.redirect('/sign-up')">Create New Account</button>
				</div>

				<!-- Floor Section -->
				<div class="floor"></div>
			</div>

			<style>
				/* Sky Animation */
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

				/* Main Page Layout */
				.landing-page {
					position: relative;
					padding-top: 25%; /* Reduced padding to match the sky height */
					overflow: hidden; /* Prevent scrollbars caused by animation */
					min-height: 100vh; /* Ensure the page fills the screen */
					height: 100vh;
					box-sizing: border-box;
				}

				/* Floor Styling */
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
			</style>
		`;
	}
}

customElements.define("landing-page", LandingPage);
