import { Component } from "../../Component.js";

export class GameHeatMap extends Component {
	constructor() {
		super();
		this.stats = {};
	}

	renderGameHeatMap(stats) {
		this.stats = stats;
		this.update();
	}

	postRender() {}

	render() {}

	style() {}
}

customElements.define("game-heat-map", GameHeatMap);
