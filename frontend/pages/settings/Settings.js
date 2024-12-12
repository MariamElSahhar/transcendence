import { Component } from "../Component.js";
// import {userManagementClient} from '@utils/api';
// import {getRouter} from '../js/router.js';

export class Settings extends Component {
	constructor() {
		super();
	}

	async connectedCallback() {
		await import("../components/layouts/FriendsSidebar.js");
		super.connectedCallback();
	}

	render() {
		return ``;
	}
	//   <friends-sidebar-component main-component="settings-content-component"></friends-sidebar-component>`
}

customElements.define("settings-page", Settings);
