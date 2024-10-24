import { Component } from "./components/Component.js";
import { isAuth } from "../../../js/clients/token-client.js";

export class HomePage extends Component {
	constructor() {
		super();
	}
	render() {
		if (isAuth()) {
			return `
      <navbar-component nav-active="home"></navbar-component>
      <friends-sidebar-component main-component="home-content-component"></friends-sidebar-component>
    `;
		} else {
			return `
        <navbar-component nav-active="home"></navbar-component>
        <home-content-component></home-content-component>
      `;
		}
	}
}

customElements.define("home-page", HomePage);
