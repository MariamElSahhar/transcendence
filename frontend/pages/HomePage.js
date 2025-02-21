import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { Component } from "./Component.js";

export class HomePage extends Component {
	topScene = null;
	topRenderer = null;
	topCamera = null;
	topSphere = null;
	topAnimationId = null;

	bottomScene = null;
	bottomRenderer = null;
	bottomCamera = null;
	bottomX = null;
	bottomO = null;
	bottomAnimationId = null;
	directionX = 0.02;
	directionY = 0.02;

	constructor() {
		super();
	}

	async connectedCallback() {
		super.connectedCallback();
		this.initTopSphere();
		this.initBottomShapes();
	}

	render() {
		return `
            <div class="d-flex flex-column align-items-center p-3 ">
                <div class="w-100">
                    <!-- Pong Section -->
                    <div class="game-section ">
                        <div id="top-canvas" class="game-canvas"></div>
                        <div class="row mb-3  align-items-center justify-content-center">
							<div class="col-5">
                            	<button id="play-single-player-game" class="d-flex align-items-center justify-content-between brick-border btn btn-primary w-100 p-3 fw-bold">
									<img src="/assets/sprites/mario.png" class="ms-4 btn-icon" alt="Left Icon">
										Single Player
									<img src="/assets/sprites/luigi.png" class="btn-icon me-4" alt="Right Icon">
								</button>
							</div>
							<div class="col-5">
                            	<button id="play-two-player-game" class="d-flex align-items-center justify-content-between brick-border btn btn-primary w-100 p-3 fw-bold">
									<img src="/assets/sprites/mario.png" class="ms-4 btn-icon" alt="Left Icon">
										Two Player
									<img src="/assets/sprites/robot.png" class="btn-icon me-4" alt="Right Icon">
								</button>
							</div>
						</div>
						<div class="row mb-3 align-items-center justify-content-center">
							<div class="col-5">
                            	<button id="play-remote-game" class="d-flex align-items-center justify-content-between brick-border btn btn-primary w-100 p-3 fw-bold">
									<img src="/assets/sprites/mario.png" class="ms-4 btn-icon" alt="Left Icon">
										Online Two Player
									<img src="/assets/sprites/mario.png" class="btn-icon me-4" alt="Right Icon">
								</button>
							</div>
							<div class="col-5">
                            	<button id="play-tournament" class="d-flex align-items-center justify-content-between brick-border btn btn-primary w-100 p-3 fw-bold">
									<img src="/assets/sprites/mario.png" class="ms-4 btn-icon" alt="Left Icon">
										Tournament
									<img src="/assets/sprites/mario.png" class="btn-icon me-4" alt="Right Icon">
								</button>
							</div>
                        </div>
                    </div>

                    <!-- Tic Tac Toe Section -->
                    <div class="game-section d-flex flex-column align-items-center justify-content-center">
    					<div id="bottom-canvas" class="game-canvas"></div>
   						<div class="btn-container  w-50 d-flex justify-content-center">
        					<button id="play-ttt" class="d-flex align-items-center justify-content-between brick-border btn btn-success w-100 p-3 fw-bold">
								<img src="/assets/sprites/mario.png" class="ms-4 btn-icon" alt="Left Icon">
									Tic Tac Toe
								<img src="/assets/sprites/mario.png" class="btn-icon me-4" alt="Right Icon">
							</button>
    					</div>
					</div>
                </div>
            </div>
    `;
	}

	style() {
		return `
		<style>
		.brick-border {
			border: none !important;
			border-radius: 0 !important;
			border-bottom: 1px solid #513604 !important;
			border-right: 1px solid #513604 !important;
		}
		.btn-icon {
			width: 30px;
			height: 30px;
		}
		</style>
		`;
	}

	postRender() {
		window.addEventListener("resize", this.onWindowResize.bind(this));

		// Play Local Game Button
		super.addComponentEventListener(
			this.querySelector("#play-single-player-game"),
			"click",
			() => {
				window.redirect("/play/single-player");
			}
		);
		super.addComponentEventListener(
			this.querySelector("#play-two-player-game"),
			"click",
			() => {
				window.redirect("/play/two-player");
			}
		);

		// Play Remote Game Button
		super.addComponentEventListener(
			this.querySelector("#play-remote-game"),
			"click",
			() => {
				window.redirect("/play/remote");
			}
		);

		// Join Tournament Button
		super.addComponentEventListener(
			this.querySelector("#play-tournament"),
			"click",
			() => {
				window.redirect("/play/tournament");
			}
		);

		// Play Tic Tac Toe Remotely Button
		super.addComponentEventListener(
			this.querySelector("#play-ttt"),
			"click",
			() => {
				window.redirect("/play/tictactoe");
			}
		);
	}

	onWindowResize() {
		this.resizeRenderer(this.topCamera, this.topRenderer, "#top-canvas");
		this.resizeRenderer(
			this.bottomCamera,
			this.bottomRenderer,
			"#bottom-canvas"
		);
	}

	resizeRenderer(camera, renderer, canvasSelector) {
		const container = this.querySelector(canvasSelector);
		if (camera && renderer && container) {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		}
	}

	initTopSphere() {
		const container = this.querySelector("#top-canvas");
		container.innerHTML = "";

		if (this.topAnimationId) cancelAnimationFrame(this.topAnimationId);

		this.topScene = new THREE.Scene();
		this.topCamera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		this.topRenderer = new THREE.WebGLRenderer({ antialias: true });
		this.topRenderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(this.topRenderer.domElement);

		this.topCamera.position.z = 5;

		const geometry = new THREE.SphereGeometry(1, 32, 32);
		const material = new THREE.MeshNormalMaterial();
		this.topSphere = new THREE.Mesh(geometry, material);
		this.topScene.add(this.topSphere);

		let directionX = 0.02;
		let directionY = 0.02;

		const animate = () => {
			this.topAnimationId = requestAnimationFrame(animate);
			this.topSphere.rotation.x += 0.01;
			this.topSphere.rotation.y += 0.01;

			// Movement
			this.topSphere.position.x += directionX;
			this.topSphere.position.y += directionY;

			// Bounce within boundaries
			if (this.topSphere.position.x > 2 || this.topSphere.position.x < -2)
				directionX = -directionX;
			if (this.topSphere.position.y > 2 || this.topSphere.position.y < -2)
				directionY = -directionY;

			this.topRenderer.render(this.topScene, this.topCamera);
		};

		animate();
	}

	initBottomShapes() {
		const container = this.querySelector("#bottom-canvas");
		container.innerHTML = "";

		if (this.bottomAnimationId)
			cancelAnimationFrame(this.bottomAnimationId);

		this.bottomScene = new THREE.Scene();
		this.bottomCamera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		this.bottomRenderer = new THREE.WebGLRenderer({ antialias: true });
		this.bottomRenderer.setSize(
			container.clientWidth,
			container.clientHeight
		);
		container.appendChild(this.bottomRenderer.domElement);

		this.bottomCamera.position.z = 5;

		// Create X shape
		const xGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
		const xMaterial = new THREE.MeshNormalMaterial();
		this.bottomX = new THREE.Group();
		const arm1 = new THREE.Mesh(xGeometry, xMaterial);
		const arm2 = new THREE.Mesh(xGeometry, xMaterial);
		arm1.rotation.z = Math.PI / 4;
		arm2.rotation.z = -Math.PI / 4;
		this.bottomX.add(arm1, arm2);
		this.bottomX.position.set(0, 0, 0); // Centered position
		this.bottomScene.add(this.bottomX);

		// Create O shape
		const oGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 100);
		this.bottomO = new THREE.Mesh(oGeometry, xMaterial);
		this.bottomO.position.set(0, 0, 0); // Centered position
		this.bottomScene.add(this.bottomO);

		// Initial velocities, reduced for slower movement
		const xVelocity = { x: 0.02, y: 0.02 }; // Slower velocity for X
		const oVelocity = { x: -0.02, y: -0.02 }; // Slower velocity for O

		const animate = () => {
			this.bottomAnimationId = requestAnimationFrame(animate);

			// Update positions based on velocity
			this.bottomX.position.x += xVelocity.x;
			this.bottomX.position.y += xVelocity.y;
			this.bottomO.position.x += oVelocity.x;
			this.bottomO.position.y += oVelocity.y;

			// Check for boundary collisions for X
			if (
				this.bottomX.position.x > container.clientWidth / 200 ||
				this.bottomX.position.x < -container.clientWidth / 200
			) {
				xVelocity.x = -xVelocity.x;
			}
			if (
				this.bottomX.position.y > container.clientHeight / 200 ||
				this.bottomX.position.y < -container.clientHeight / 200
			) {
				xVelocity.y = -xVelocity.y;
			}

			// Check for boundary collisions for O
			if (
				this.bottomO.position.x > container.clientWidth / 200 ||
				this.bottomO.position.x < -container.clientWidth / 200
			) {
				oVelocity.x = -oVelocity.x;
			}
			if (
				this.bottomO.position.y > container.clientHeight / 200 ||
				this.bottomO.position.y < -container.clientHeight / 200
			) {
				oVelocity.y = -oVelocity.y;
			}

			// Continuous rotation
			this.bottomX.rotation.y += 0.01;
			this.bottomO.rotation.y += 0.01;

			this.bottomRenderer.render(this.bottomScene, this.bottomCamera);
		};

		animate();
	}
}

customElements.define("home-page", HomePage);
