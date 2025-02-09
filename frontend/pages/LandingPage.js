import { Component } from "./Component.js";
import { Footer } from "../layouts/components/Footer.js";

export class LandingPage extends Component {
	constructor() {
		super();
	}

	render() {
		return `
			<div class="landing-page d-flex flex-column justify-content-center align-items-center min-vh-100 position-relative">
				<!-- Sky Section -->
				<div class="sky"></div>

				<!-- Title Image -->
				<img class="title-img" src="/assets/titlepage.png" alt="Welcome to Pong!"/>

				<!-- Main Content Section -->
				<div class="d-flex flex-column justify-content-center align-items-center gap-2">
				</div>

				<!-- Floor Section -->
				<div class="pipes-container d-flex">
					<div class="left-pipe-container">
						<img class="pipe" src="/assets/pipe.png" alt="X"/>
						<img class="plant" src="/pages/tictactoe/plant.png" alt="X" onclick="window.redirect('/login')"/>
					</div>
					<div class="right-pipe-container">
						<img class="pipeRight" src="/assets/pipe.png" alt="X"/>
						<img class="shroom" src="/pages/tictactoe/shroom.png" alt="X" onclick="window.redirect('/sign-up')"/>
					</div>
				</div>
				<footer-component class="mt-auto"></footer-component>
			</div>
		`;
	}

	style() {
		return `
			<style>
				.landing-page {
					background-color: rgb(135, 206, 235);
				}

				/* Sky Animation */
				.sky {
					display: flex;
					background: url(/pages/tictactoe/sky.png);
					background-size: contain;
					background-repeat: repeat-x;
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 20em;
					animation: move-sky 500s linear infinite;
					z-index: 1;
					opacity: 0.2;
				}

				@keyframes move-sky {
					from {
						background-position: 0 0;
					}
					to {
						background-position: 10000px 0;
					}
				}

				.title-img {
					animation: jump 4s ease-in-out infinite;
					z-index: 1;
				}

				.left-pipe-container {
					position: absolute;
					bottom: 0em; /* Adjust this value to align with the floor height */
					left: 40%; /* Centers the pipe horizontally */
					transform: translateX(-50%); /* Centers the pipe perfectly */
					z-index: 2; /* Ensures the pipe appears above the floor */
					height: 15em; /* Adjust pipe size */
				}

				.pipe {
					position: absolute;
					bottom: 10em; /* Adjust this value to align with the floor height */
					left: 20%; /* Centers the pipe horizontally */
					transform: translateX(-50%); /* Centers the pipe perfectly */
					z-index: 3; /* Ensures the pipe appears above the floor */
					height: 15em; /* Adjust pipe size */
				}

				/* Plant styling */
				.plant {
					position: absolute;
					bottom: 10em; /* Adjust this value to align with the floor height */
					left: 20%; /* Centers the plant horizontally */
					transform: translateX(-50%); /* Centers the plant perfectly */
					z-index: 2; /* Ensure it's above the pipe */
					height: 7em; /* Adjust plant size */
					transition: bottom 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
				}

				.left-pipe-container:hover .plant {
					bottom: 24.5em; /* Move the plant up to the same level as the pipe */
				}

				.right-pipe-container {
					position: absolute;
					bottom: 0em; /* Adjust this value to align with the floor height */
					right: 30em; /* Position container from the right side */
					z-index: 2; /* Ensures the container is above the floor */
					height: 15em; /* Adjust pipe size */
				}

				.pipeRight {
					position: absolute;
					bottom: 10em; /* Align this value with the floor height */
					right: 3em; /* Same as container to align horizontally */
					z-index: 3; /* Ensures the pipe appears above the floor */
					height: 15em; /* Adjust pipe size */
				}

				.shroom {
					position: absolute;
					bottom: 10em; /* Align with the pipe at the same floor level */
					right: 5.5em; /* Same as pipeRight to align horizontally */
					z-index: 2; /* Ensure it's above the pipe */
					height: 7em; /* Adjust plant size */
					transition: bottom 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
				}

				.right-pipe-container:hover .shroom {
					bottom: 24.5em; /* Move the plant up to the same level as the pipe */
				}
			</style>
		`;
	}
}

customElements.define("landing-page", LandingPage);
