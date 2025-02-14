import { Component } from "./Component.js";
import { Footer } from "../layouts/components/Footer.js";

export class LandingPage extends Component {
	constructor() {
		super();
	}

	render() {
		return `
			<div class="landing-page d-flex flex-column justify-content-center align-items-center min-vh-100 h-100 position-relative overflow-hidden">
				<div class="page-contents h-100 w-100 d-flex flex-column justify-content-between align-items-center">
					<!-- Sky -->
					<div class="sky z-0"></div>

					<!-- Main Content Section -->
					<div class="d-flex flex-column justify-content-center align-items-center gap-3">
						<img class="title-img z-1" src="/assets/titlepage.png" alt="Welcome to Pong!"/>
						<div class="d-flex flex-column justify-content-center align-items-center gap-2 w-100">
							<button id="login-button" class="btn" onclick="window.redirect('/login')" class="z-3">Log In</button>
							<button id="sign-up-button" class="btn" onclick="window.redirect('/sign-up')" class="z-3">Sign Up</button>
						</div>
					</div>

					<!-- Pipes Section -->
					<div class="pipes-container d-flex w-100 justify-content-center">
						<div class="left-pipe-container d-flex flex-column position-relative align-items-center">
							<img class="pipe left-pipe z-3" src="/assets/pipe.png" alt="X"/>
							<img  id="plant" class="pipe-content z-2" src="/pages/tictactoe/plant.png" alt="X"/>
						</div>
						<div class="right-pipe-container d-flex flex-column position-relative align-items-center">
							<img class="pipe right-pipe z-3" src="/assets/pipe.png" alt="X"/>
							<img id="shroom" class="pipe-content z-2" src="/pages/tictactoe/shroom.png" alt="X"/>
						</div>
					</div>
				</div>
				<!-- Footer -->
				<footer-component class="mt-auto"></footer-component>
			</div>
		`;
	}

	style() {
		return `
			<style>
				#login-button, #sign-up-button {
					width: 40%;
				}

				.sky {
					display: flex;
					background: url(/assets/sky.png);
					background-size: contain;
					background-repeat: repeat-x;
					width: 500%;
					height: 10em;
					animation: move-sky 500s linear infinite;
					z-index: 1;
				}

				@keyframes move-sky {
					from {
						background-position: 0 0;
					}
					to {
						background-position: 100% 0;
					}
				}

				.title-img {
					animation: jump 4s ease-in-out infinite;
					width: 70%;
				}

				@keyframes jump {
					0%, 100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-20px);
					}
				}

				.pipes-container {
					gap: 35%;
				}

				.pipe {
					height: 12em;
				}

				.pipe-content {
					position: absolute;
					bottom: 6em;
					height: 5em;
					transition: bottom 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
				}
			</style>
		`;
	}

	postRender() {
		const loginButton = document.querySelector("#login-button");
		const signupButton = document.querySelector("#sign-up-button");
		const plant = document.querySelector("#plant");
		const shroom = document.querySelector("#shroom");

		super.addComponentEventListener(loginButton, "mouseenter", () => {
			plant.style.bottom = "12em";
		});
		super.addComponentEventListener(loginButton, "mouseleave", () => {
			plant.style.bottom = "6em";
		});
		super.addComponentEventListener(signupButton, "mouseenter", () => {
			shroom.style.bottom = "12em";
		});
		super.addComponentEventListener(signupButton, "mouseleave", () => {
			shroom.style.bottom = "6em";
		});
	}
}

customElements.define("landing-page", LandingPage);
