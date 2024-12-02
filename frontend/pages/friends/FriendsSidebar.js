import { Component } from "../Component.js";

export class FriendsSidebar extends Component {
	render() {
		const sidebarPositionClass = "";
		// const sidebarPositionClass = "active";
		return `
            <div id="friends-sidebar">
                <h1>HI</h1>
            </div>
        `;
	}

	async connectedCallback() {
		await import("./FriendItem.js");
	}

	// style() {
	// 	return `
	// 	<style>
	// 		#sidebar-content {
	// 			width: 250px;
	// 			position: fixed;
	// 			top: 0;
	// 			left: calc(100% - 250px);
	// 			height: 100vh;
	// 			z-index: 999;
	// 			transition: all 0.3s;
	// 			background-color: var(--bs-secondary-bg);
	// 		}

	// 		#sidebar-content.active {
	// 			margin-left: +250px;
	// 		}

	// 		a[data-toggle="collapse"] {
	// 			position: relative;
	// 		}

	// 		@media (max-width: 768px) {
	// 			#sidebar-content {
	// 				width: 100vw;
	// 				position: fixed;
	// 				top: 0;
	// 				padding-left: 0.5rem;
	// 				left: calc(0px);
	// 				height: 100vh;
	// 				z-index: 999;
	// 				transition: all 0.3s;
	// 			}
	// 			#sidebar-content.active {
	// 				margin-left: +2500px;
	// 			}
	// 			#main-content {
	// 				width: 100%;
	// 			}
	// 			#main-content.active {
	// 				width: calc(-100%);
	// 			}
	// 		}

	// 		#main-content {
	// 			width: calc(100% - 250px);
	// 			position: absolute;
	// 			transition: all 0.3s;
	// 		}

	// 		#main-content.active {
	// 			width: 100%;
	// 		}
	// 	</style>
	// `;
	// }
}

customElements.define("friends-sidebar", FriendsSidebar);
