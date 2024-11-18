import { UniformsLib } from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
//"../../../../node_modules/three/build/three.module.js";;
import { RectAreaLightTexturesLib } from './RectAreaLightTexturesLib.js';

class RectAreaLightUniformsLib {

	static init() {

		RectAreaLightTexturesLib.init();

		const { LTC_FLOAT_1, LTC_FLOAT_2, LTC_HALF_1, LTC_HALF_2 } = RectAreaLightTexturesLib;

		// data textures

		UniformsLib.LTC_FLOAT_1 = LTC_FLOAT_1;
		UniformsLib.LTC_FLOAT_2 = LTC_FLOAT_2;

		UniformsLib.LTC_HALF_1 = LTC_HALF_1;
		UniformsLib.LTC_HALF_2 = LTC_HALF_2;

	}

}

export { RectAreaLightUniformsLib };