import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { OrbitControls } from "./controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "./controls/RectAreaLightUniformsLib.js";
export class _ThreeJS {
	#renderer;
	#camera;
	#engine;
	#controls;
	#isAIEnabled = false; // New property to toggle AI-specific camera adjustments

	constructor(engine, isAIEnabled = false) {
		// Accept isAIEnabled flag
		this.#engine = engine;
		this.#isAIEnabled = isAIEnabled;
		this.#initRenderer();
		this.#initCamera();
		this.#controls = new OrbitControls(
			this.#camera,
			this.#renderer.domElement
		);
		this.#controls.target.set(0, 0, 0);

		// If AI is enabled, lock the controls to prevent manual camera manipulation
		this.#controls.enablePan = !isAIEnabled;
		this.#controls.enableRotate = !isAIEnabled;
		this.#controls.enableZoom = !isAIEnabled;

		this.#engine.component.addComponentEventListener(
			window,
			"resize",
			() => {
				this.#onWindowResize();
				this.#engine.resizeHandler();
			},
			this
		);
	}

	get width() {
		const style = window.getComputedStyle(this.#engine.component.container);
		const marginLeft = style.getPropertyValue("margin-left");
		const marginRight = style.getPropertyValue("margin-right");
		return window.innerWidth - parseInt(marginLeft) - parseInt(marginRight);
	}

	get height() {
		const style = window.getComputedStyle(this.#engine.component.container);
		const marginTop = style.getPropertyValue("margin-top");
		const marginBottom = style.getPropertyValue("margin-bottom");
		return (
			document.querySelector("#slot").offsetHeight -
			parseInt(marginTop) -
			parseInt(marginBottom)
		);
	}

	#initRenderer() {
		this.#renderer = new THREE.WebGLRenderer({ antialias: true });
		this.#renderer.shadowMap.enabled = true;
		this.#renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.#renderer.setPixelRatio(window.devicePixelRatio * 0.8);
		this.#renderer.setSize(this.width, this.height);
		this.#renderer.domElement.classList.add("rounded");

		const container = this.#engine.component?.container;
		if (container) {
			container.appendChild(this.#renderer.domElement);
		} else {
			console.error(
				"Container is not defined; renderer cannot be appended."
			);
		}
		RectAreaLightUniformsLib.init();
	}

	#initCamera() {
		this.#camera = new THREE.PerspectiveCamera(
			59,
			this.width / this.height,
			0.1,
			1000
		);

		this.#camera.position.set(15, -52, 17);
		this.#camera.lookAt(0, 0, -1);
		this.#camera.up.set(0, 0, 1);
	}

	#onWindowResize() {
		this.#renderer.setSize(this.width, this.height);

		this.#camera.aspect = this.width / this.height;
		this.#camera.updateProjectionMatrix();
	}

	setCameraPosition(position) {
		this.#camera.position.set(position.x, position.y, position.z);
	}

	setCameraLookAt(position) {
		this.#camera.lookAt(position.x, position.y, position.z);
	}

	getCameraVerticalFOVRadian() {
		return (this.#camera.fov * Math.PI) / 180.0;
	}

	getCameraHorizontalFOVRadian() {
		const vFOV = this.getCameraVerticalFOVRadian();
		const aspect = this.width / this.height;
		return 2.0 * Math.atan(Math.tan(vFOV / 2.0) * aspect);
	}

	setAnimationLoop(loopFunction) {
		this.#renderer.setAnimationLoop(loopFunction);
	}

	stopAnimationLoop() {
		this.#renderer.setAnimationLoop(null);
	}

	updateControls() {
		if (!this.#isAIEnabled) {
			// Only update controls if AI is disabled
			this.#controls.update();
		}
	}

	renderFrame(scene) {
		this.#renderer.render(scene, this.#camera);
	}

	clearRenderer() {
		this.#renderer.dispose();
	}

	get controls() {
		return this.#controls;
	}
}
