import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { Sky } from "../../game-utils/controls/Sky.js";

export class SceneSky {
	#sky;
	#sun;

	constructor() {
		this.#sky = new Sky();
		this.#sun = new THREE.Vector3();
		this.#sky.scale.setScalar(45000); // Large sky dome scale

		// Ensure the sky shader initializes with correct theme
		this.applyTheme();

		// Set up vector for shader orientation
		this.#sky.material.uniforms.up.value.set(0, 0, 1);
		this.#sky.material.needsUpdate = true; // Force shader update
	}

	//Apply theme-based sky colors at initialization
	applyTheme() {
		this.setBrighterDay();
		console.log("only Brighter daylight sky theme applied");
	}

	setBrighterDay() {
		// Set sun position high in the sky for bright midday effect
		this.#sun.set(
			1,
			THREE.MathUtils.degToRad(0),
			THREE.MathUtils.degToRad(0)
		);
		const uniforms = this.#sky.material.uniforms;

		// Configure sky shader parameters for bright daytime sky
		uniforms.turbidity.value = 10; // Very low haze for maximum clarity
		uniforms.rayleigh.value = 8; // High scattering for vivid blue
		uniforms.mieCoefficient.value = 0.0001; // Minimal haze to maximize brightness
		uniforms.mieDirectionalG.value = 0.1; // Spread light evenly

		// Apply sun position
		uniforms.sunPosition.value.copy(this.#sun);
		this.#sky.material.needsUpdate = true; // Ensure shader updates

		console.log("Brighter daylight sky theme applied");
	}

	get sky() {
		return this.#sky;
	}
}
