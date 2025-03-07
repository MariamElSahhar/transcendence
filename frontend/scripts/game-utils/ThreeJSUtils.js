import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { OrbitControls } from "./controls/OrbitControls.js";
import { showError } from "../../pages/error/ErrorPage.js";

export class ThreeJSUtils {
	constructor(engine) {
		this.appEngine = engine;
		this.container = engine.component?.container;
		if (!this.container) {
			showError();
			console.error(
				"Engine container is not available; renderer cannot be appended."
			);
		}

		this.setupRenderer();
		this.setupCamera();

		this.controls = new OrbitControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.target.set(0, 0, 0);

		this._resizeHandler = () => {
			this.handleResize();
			if (this.appEngine.resizeHandler) {
				this.appEngine.resizeHandler();
			}
		};
		window.addEventListener("resize", this._resizeHandler);
	}

	get viewportWidth() {
		if (!this.container) return window.innerWidth;
		const style = window.getComputedStyle(this.container);
		const leftMargin = parseInt(style.marginLeft, 10) || 0;
		const rightMargin = parseInt(style.marginRight, 10) || 0;
		return window.innerWidth - leftMargin - rightMargin;
	}

	get viewportHeight() {
		if (!this.container) return window.innerHeight;
		const style = window.getComputedStyle(this.container);
		const topMargin = parseInt(style.marginTop, 10) || 0;
		const bottomMargin = parseInt(style.marginBottom, 10) || 0;
		const slotElement = document.querySelector("#slot");
		const slotHeight = slotElement
			? slotElement.offsetHeight
			: window.innerHeight;
		return slotHeight - topMargin - bottomMargin;
	}

	setupRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			powerPreference: "high-performance",
		});
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setPixelRatio(window.devicePixelRatio * 0.8);
		this.renderer.setSize(this.viewportWidth, this.viewportHeight);
		if (this.container) {
			this.container.appendChild(this.renderer.domElement);
		}
	}

	setupCamera() {
		this.camera = new THREE.PerspectiveCamera(
			59,
			this.viewportWidth / this.viewportHeight,
			0.1,
			1000
		);
		this.camera.position.set(15, -52, 17);
		this.camera.lookAt(0, 0, -1);
		this.camera.up.set(0, 0, 1);
	}

	handleResize() {
		this.renderer.setSize(this.viewportWidth, this.viewportHeight);
		this.camera.aspect = this.viewportWidth / this.viewportHeight;
		this.camera.updateProjectionMatrix();
	}

	updateCameraPosition({ x, y, z }) {
		this.camera.position.set(x, y, z);
	}

	updateCameraLookAt({ x, y, z }) {
		this.camera.lookAt(x, y, z);
	}

	getVerticalFOV() {
		return (this.camera.fov * Math.PI) / 180;
	}

	getHorizontalFOV() {
		const vFOV = this.getVerticalFOV();
		return (
			2 *
			Math.atan(
				Math.tan(vFOV / 2) * (this.viewportWidth / this.viewportHeight)
			)
		);
	}

	startAnimationLoop(callback) {
		this.renderer.setAnimationLoop(callback);
	}

	stopAnimationLoop() {
		this.renderer.setAnimationLoop(null);
	}

	refreshControls() {
		this.controls.update();
	}

	renderScene(scene) {
		this.renderer.render(scene, this.camera);
	}

	disposeResources() {
		window.removeEventListener("resize", this._resizeHandler);
		this.renderer.dispose();
	}

	get orbitControls() {
		return this.controls;
	}

	getCurrentCamera() {
		return this.camera;
	}

	get webGLRenderer() {
		return this.renderer;
	}
}
