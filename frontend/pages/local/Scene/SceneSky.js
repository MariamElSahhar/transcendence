import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { Theme } from "../../utils/Theme.js";
import { Sky } from "../controls/Sky.js";

export class SceneSky {
    #sky;
    #sun;

    constructor() {
        this.#sky = new Sky();
        this.#sun = new THREE.Vector3();
        this.#sky.scale.setScalar(45000); // Large sky dome scale

        //Apply theme-based sky settings on initialization
        if (Theme.get() === 'light') {
            this.setBrighterDay();
        } else {
            this.setPolarNight();
        }

        // Set up vector for shader orientation
        this.#sky.material.uniforms.up.value.set(0, 0, 1);
    }

    setBrighterDay() {
        // Set sun position high to simulate a bright midday sun
        this.#sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(5), THREE.MathUtils.degToRad(180));
        const uniforms = this.#sky.material.uniforms;

        // Bright daytime sky parameters
        uniforms.turbidity.value = 1;            // Minimal haze for a clear sky
        uniforms.rayleigh.value = 3;             // Strong scattering for vivid blue
        uniforms.mieCoefficient.value = 0.0001;   // Minimal haze to maximize brightness
        uniforms.mieDirectionalG.value = 0.4;    // Lower directionality to spread light evenly

        uniforms.sunPosition.value.copy(this.#sun);
        this.#sky.material.needsUpdate = true; // Force shader update
        console.log("Bright daylight sky applied");
    }

    setPolarNight() {
        // Set sun position low to simulate twilight
        this.#sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(5), THREE.MathUtils.degToRad(180));
        const uniforms = this.#sky.material.uniforms;

        // Dusk/twilight sky parameters
        uniforms.turbidity.value = 15;           // High haze for a soft, dim sky
        uniforms.rayleigh.value = 0.5;           // Reduced scattering for darker sky
        uniforms.mieCoefficient.value = 0.01;    // Increased haze for diffused light
        uniforms.mieDirectionalG.value = 0.85;   // High directionality for softer shadows

        uniforms.sunPosition.value.copy(this.#sun);
        this.#sky.material.needsUpdate = true;
        console.log("Twilight sky theme applied");
    }

    get sky() {
        return this.#sky;
    }
}

// import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
// import { Sky } from "../controls/Sky.js";
// import { Theme } from "../../../utils/Theme.js"; 

// export class SceneSky {
//     #sky;
//     #sun;
  
//     constructor() {
//         this.#sky = new Sky();
//         this.#sun = new THREE.Vector3();
//         this.#sky.scale.setScalar(45000); // Set sky dome size
        
//         // Ensure the sky shader initializes with correct theme
//         this.applyTheme();

//         // Set up vector for shader orientation
//         this.#sky.material.uniforms.up.value.set(0, 0, 1);
//         this.#sky.material.needsUpdate = true; // Force shader update
//     }

//     //Apply theme-based sky colors at initialization
//     applyTheme() {
//         if (Theme.get() === 'light') {
//             this.setBrighterDay();
//         } else {
//             this.setPolarNight();
//         }
//     }

//     setBrighterDay() {
//         // Set sun position high in the sky for bright midday effect
//         this.#sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0));
//         const uniforms = this.#sky.material.uniforms;

//         // Configure sky shader parameters for bright daytime sky
//         uniforms.turbidity.value = 10;             // Very low haze for maximum clarity
//         uniforms.rayleigh.value = 8;              // High scattering for vivid blue
//         uniforms.mieCoefficient.value = 0.0001;   // Minimal haze to maximize brightness
//         uniforms.mieDirectionalG.value = 0.1;     // Spread light evenly

//         // Apply sun position
//         uniforms.sunPosition.value.copy(this.#sun);
//         this.#sky.material.needsUpdate = true; // Ensure shader updates

//         console.log("Brighter daylight sky theme applied");
//     }
    
//     setPolarNight() {
//         // Set sun position low for a dim twilight effect
//         this.#sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(5), THREE.MathUtils.degToRad(180));
//         const uniforms = this.#sky.material.uniforms;

//         // Configure sky shader parameters for twilight
       
//         // Dusk/twilight sky parameters
//         uniforms.turbidity.value = 15;           // High haze for a soft, dim sky
//         uniforms.rayleigh.value = 0.5;           // Reduced scattering for darker sky
//         uniforms.mieCoefficient.value = 0.01;    // Increased haze for diffused light
//         uniforms.mieDirectionalG.value = 0.85;   // High directionality for softer shadows

//         // Apply sun position
//         uniforms.sunPosition.value.copy(this.#sun);
//         this.#sky.material.needsUpdate = true;

//         console.log("Polar night theme applied");
//     }

//     get sky() {
//         return this.#sky;
//     }
// }


//different vergion
// import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";

// import { Sky } from "../controls/Sky.js";
// import { Theme } from "../../../utils/Theme.js"; 

// export class SceneSky {
//     #sky;
//     #sun;
  
//     constructor() {
//       this.#sky = new Sky();
//       this.#sun = new THREE.Vector3();
//       this.#sky.scale.setScalar(45000);
//       const uniforms = this.#sky.material.uniforms;
//       uniforms.sunPosition.value.copy(this.#sun);
//       uniforms.turbidity.value = 10;
//       uniforms.rayleigh.value = 3;
//       uniforms.mieCoefficient.value = 0.005;
//       uniforms.mieDirectionalG.value = 0.7;
//       if (Theme.get() === 'light') {
//         this.setLightTheme();
//       } else {
//         this.setDarkTheme();
//       }
//       this.#sky.material.uniforms.up.value.set(0, 0, 1);
//     }
  
//     setLightTheme() {
//       this.#sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(0), 0);
//       const uniforms = this.#sky.material.uniforms;
//       uniforms.sunPosition.value.copy(this.#sun);
//     }
  
//     setDarkTheme() {
//       this.#sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(-5), 0);
//       const uniforms = this.#sky.material.uniforms;
//       uniforms.sunPosition.value.copy(this.#sun);
//     }
  
//     get sky() {
//       return this.#sky;
//     }
//   }
