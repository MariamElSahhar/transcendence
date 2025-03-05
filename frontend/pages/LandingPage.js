import { Component } from "./Component.js";
import { Footer } from "../layouts/components/Footer.js";

export class LandingPage extends Component {
	constructor() {
		super();
	}

	render() {
		return `
			<div class="d-flex flex-column h-100 w-75 justify-content-center align-items-center gap-3">
				<img class="title-img z-1" src="/assets/titlepage.webp" alt="Welcome to Pong!"/>
				<div class="d-flex flex-column justify-content-center align-items-center gap-2 w-100">
					<button id="login-button" class="btn" class="z-3">Log In</button>
					<button id="sign-up-button" class="btn" class="z-3">Sign Up</button>
				</div>
			</div>
		`;
	}

	style() {
		return `
			<style>
				#login-button, #sign-up-button {
					width: 40%;
				}

				.title-img {
					animation: jump 4s ease-in-out infinite;
					width: 70%;
				}

			</style>
		`;
	}

	postRender() {
		const loginButton = document.querySelector("#login-button");
		const signupButton = document.querySelector("#sign-up-button");
		const plant = document.querySelector("#plant");
		const shroom = document.querySelector("#shroom");

		super.addComponentEventListener(loginButton, "click", () => {
			window.redirect("/login");
		});
		super.addComponentEventListener(signupButton, "click", () => {
			window.redirect("/sign-up");
		});
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
