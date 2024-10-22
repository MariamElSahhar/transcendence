import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js";
import WebGL from "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/capabilities/WebGL.js";

class HomeContent extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.scene = null;
		this.renderer = null;
		this.camera = null;
	}

	async connectedCallback() {
		this.render();
		this.initThreeJS();
	}

	render() {
		this.shadowRoot.innerHTML = `
        <style>
          #canvas-container {
            width: 100%;
            height: 100%;
          }
        </style>
        <div id="canvas-container">
          <h1> Home Content </h1>
        </div>
      `;
	}

	initThreeJS() {
		const container = this.shadowRoot.querySelector("#canvas-container");

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

		this.camera.position.z = 5;

		const geometry = new THREE.BoxGeometry();
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		this.scene.add(cube);

		this.animate();
	}

	animate() {
		requestAnimationFrame(() => this.animate());

		// Example animation logic
		this.scene.children[0].rotation.x += 0.01;
		this.scene.children[0].rotation.y += 0.01;

		this.renderer.render(this.scene, this.camera);
	}

	disconnectedCallback() {
		// Clean up Three.js resources when the element is removed
		if (this.renderer) {
			this.renderer.dispose();
			this.scene = null;
			this.camera = null;
		}
	}
}

// Define the custom element
customElements.define("home-content", HomeContent);
