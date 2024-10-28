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
		this.addResizeListener();
	}

	render() {
		this.shadowRoot.innerHTML = `
        <style>
          #canvas-container {
            width: 100%;
            height: 100%;
            position: relative;
          }
          canvas {
            display: block;
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

		this.camera.position.z = 10; // Move the camera back to fit the larger cube

		// Load the texture (your image)
		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load('./images/pingy_pong.png', () => {
			// When the texture is loaded, update the material
			const geometry = new THREE.BoxGeometry(4, 4, 4); // Make the cube larger (4x4x4)
			const material = new THREE.MeshBasicMaterial({ map: texture }); // Apply the texture
			const cube = new THREE.Mesh(geometry, material);
			this.scene.add(cube);
		}, undefined, (error) => {
			console.error('Error loading texture:', error);
		});

		this.animate();
	}

	addResizeListener() {
		// Handle window resizing
		window.addEventListener('resize', () => {
			this.onWindowResize();
		});
	}

	onWindowResize() {
		const container = this.shadowRoot.querySelector("#canvas-container");
		const width = container.clientWidth;
		const height = container.clientHeight;

		// Update camera aspect ratio and projection matrix
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		// Resize renderer
		this.renderer.setSize(width, height);
	}

	animate() {
		requestAnimationFrame(() => this.animate());

		// Example animation logic
		if (this.scene.children.length > 0) {
			this.scene.children[0].rotation.x += 0.01;
			this.scene.children[0].rotation.y += 0.01;
		}

		this.renderer.render(this.scene, this.camera);
	}

	disconnectedCallback() {
		// Clean up Three.js resources when the element is removed
		if (this.renderer) {
			this.renderer.dispose();
			this.scene = null;
			this.camera = null;
		}

		// Remove resize listener when the component is disconnected
		window.removeEventListener('resize', this.onWindowResize);
	}
}

// Define the custom element
customElements.define("home-content", HomeContent);
