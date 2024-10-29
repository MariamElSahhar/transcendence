import {Component} from './components/Component.js';
// import {userManagementClient} from '@utils/api';
// import {getRouter} from '../js/router.js';

export class Settings extends Component {
	constructor() {
		super();
	}

	async connectedCallback() {

		// await import("./components/HomeContent.js");
		await import("./components/navbar/Navbar.js");
		await import("./components/layouts/FriendsSidebar.js");
		await import("./components/layouts/FriendsSidebar.js");
		this.render();
	}

  render() {
    // if (!userManagementClient.isAuth()) {
    //   getRouter().redirect('/signin/');
		// window.getRouter().redirect("/");
    //   return false;
    // }
    // return (`
	// console.log("plshere")
	// this.innerHTML=`<connected-navbar-component></connected-navbar-component>`
	this.innerHTML=`<navbar-component></navbar-component>
	<friends-sidebar-component main-component="settings-content-component"></friends-sidebar-component>`;
}
//   <friends-sidebar-component main-component="settings-content-component"></friends-sidebar-component>`
}

customElements.define("settings-page", Settings);