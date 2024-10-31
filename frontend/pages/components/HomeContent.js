import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js";
import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";
import { Component } from "./Component.js";

class HomeContent extends Component {
	constructor() {
		super();
		this.scene = null;
		this.renderer = null;
		this.camera = null;
		this.cube = null;
	}

	async connectedCallback() {
		super.connectedCallback();
		this.initThreeJS();
		this.render();
	}

	render() {
		return `
			<div id="canvas-container" class="h-100 w-100">
			</div>
      	`;
	}

	initThreeJS() {
		const container = this.querySelector("#canvas-container");

		// Check if WebGL is supported
		if (!WebGL.isWebGLAvailable()) {
			const warning = WebGL.getWebGLErrorMessage();
			container.appendChild(warning);
			return;
		}

		// Initialize Three.js scene
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(this.renderer.domElement);

		this.camera.position.z = 10; // Move the camera back to fit the larger cube

		// Load the texture (your image)
		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load(
			"./images/pingy_pong.png",
			() => {
				// When the texture is loaded, update the material
				const geometry = new THREE.BoxGeometry(4, 4, 4); // Make the cube larger (4x4x4)
				const material = new THREE.MeshBasicMaterial({ map: texture }); // Apply the texture
				const cube = new THREE.Mesh(geometry, material);
				this.scene.add(cube);
			},
			undefined,
			(error) => {
				console.error("Error loading texture:", error);
			}
		);

		this.animate();
	}

	onWindowResize() {
		const container = this.querySelector("#canvas-container");
		const width = container.clientWidth;
		const height = container.clientHeight;

		// Update camera aspect ratio and projection matrix
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		// Resize renderer
		this.renderer.setSize(width, height);
	}

	animate() {
		if (!this.scene) return;
		requestAnimationFrame(() => this.animate());

		// Example animation logic
		if (this.scene.children.length > 0) {
			this.scene.children[0].rotation.x += 0.01;
			this.scene.children[0].rotation.y += 0.01;
		}

		this.renderer.render(this.scene, this.camera);
	}

	disconnectedCallback() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
		}

		if (this.renderer) {
			this.renderer.dispose();
			this.renderer.domElement.remove();
			this.scene = null;
			this.camera = null;
			this.cube = null;
		}

		super.disconnectedCallback();
	}

	postRender() {
		super.addComponentEventListener(window, "resize", this.onWindowResize);
	}
}

// Define the custom element
customElements.define("home-content", HomeContent);
