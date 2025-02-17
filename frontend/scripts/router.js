import { isAuth } from "./utils/session-manager.js";
import { fetchUserById } from "./clients/users-client.js";
import { removeMatchMaking } from "./clients/gamelog-client.js";
import { closeWebSocket } from "./utils/websocket-manager.js";
window.APP_CONFIG = {
	// backendUrl: window.location.protocol=="https:" ? "": `http://${window.location.host}:8000`,
	// backendUrl: window.location.protocol=="https:" ? `https://${window.location.host}` : `http://${window.location.host}:8000`,
	mediaUrl: window.location.protocol=="https:" ? "":`http://${window.location.host}:8000`,
	backendUrl:  window.location.protocol=="https:" ? "" : `https://${window.location.host}`,
	pointsToWinPongMatch: 5,
};
const routes = {
	// PUBLIC SCREENS
	"/": {
		component: "landing-page",
		path: "../pages/LandingPage.js",
		protected: false,
		title: "Pong | Landing Page",
	},
	"/login": {
		component: "login-page",
		path: "../pages/auth/LoginPage.js",
		protected: false,
		title: "Pong | Log In",
	},
	"/sign-up": {
		component: "sign-up-page",
		path: "../pages/auth/SignUpPage.js",
		protected: false,
		title: "Pong | Sign Up",
	},
	404: {
		component: "not-found-page",
		path: "../pages/error/NotFoundPage.js",
		protected: false,
		title: "Pong | Not Found",
	},
	// PROTECTED SCREENS
	"/home": {
		layout: "sidebar",
		component: "home-page",
		path: "../pages/HomePage.js",
		protected: true,
		title: "Pong | Homepage",
	},
	"/dashboard": {
		layout: "sidebar",
		component: "dashboard-page",
		path: "../pages/dashboard/DashboardPage.js",
		protected: true,
		title: "Pong | My Dashboard",
	},
	"/play/local": {
		layout: "main",
		component: "local-game-page",
		path: "../pages/local-game/LocalGamePage.js",
		protected: true,
		title: "Pong | Local Game",
	},
	"/play/remote": {
		layout: "main",
		component: "remote-game-page",
		path: "../pages/local-game/RemoteGamePage.js",
		protected: true,
		title: "Pong | Remote Game",
	},
	"/play/tournament": {
		layout: "main",
		component: "tournament-page",
		path: "../pages/tournament/TournamentPage.js",
		protected: true,
		title: "Pong | Tournament",
	},
	"/play/tictactoe": {
		layout: "main",
		component: "tictactoe-page",
		path: "../pages/tictactoe/TictactoePage.js",
		protected: true,
		title: "Pong | Play Tictactoe",
	},
	"/friends": {
		layout: "main",
		component: "friends-page",
		path: "../pages/FriendsPage.js",
		protected: true,
		title: "Pong | My Friends",
	},
	"/settings": {
		layout: "main",
		component: "settings-page",
		path: "../pages/SettingsPage.js",
		protected: true,
		title: "Pong | Profile Settings",
	},
};

let previouspath;

const layouts = {
	main: {
		component: "main-layout",
		path: "../layouts/MainLayout.js",
	},
	sidebar: {
		component: "sidebar-layout",
		path: "../layouts/SidebarLayout.js",
	},
};

export const redirect = (path) => {
	window.history.pushState({}, "", path);
	handleLocation();
};

const handleLocation = async () => {
	const path = window.location.pathname;
	let route;
	if (path.startsWith("/dashboard/")) {
		route = (await validDashboardPath(window.location.pathname))
			? routes["/dashboard"]
			: routes[404];
	} else route = routes[path] || routes[404];

	const isProtected = route.protected;
	const authenticated = await isAuth();
	if (isProtected && !authenticated && route != routes[404]) {
		route = routes[404];
	} else if (!isProtected && authenticated && route != routes[404]) {
		route = routes["/home"];
	}
	// else if (previouspath && previouspath.startsWith("/play/remote")) {
	// 	try {
	// 		const { status, success, data } = await removeMatchMaking();
	// 		closeWebSocket();
	// 		if (success) {
	// 			console.log("Successfully removed from matchmaking queue:", data);
	// 		} else {
	// 			console.warn("Failed to remove from matchmaking queue. Status:", status);
	// 		}
	// 		if (window.timeoutID) {
	// 			console.log("CLEARED TIMEOUT")
	// 			clearTimeout(window.timeoutID);
	// 			window.timeoutID = null; // Reset the global variable
	// 		}
	// 	} catch (error) {
	// 		console.error("Error while removing from matchmaking queue:", error);
	// 	}
	// }
	// previouspath=path;
	const layout = layouts[route.layout];
	loadRoute(route, layout);
};

const loadRoute = async (route, layout) => {
	try {
		const root = document.getElementById("root");
		const routeComponent = document.createElement(route.component);
		await import(route.path);
		if (layout) {
			let layoutComponent = document.querySelector(layout.component);
			// load layout if it isn't already there
			if (!layoutComponent) {
				root.innerHTML = "";
				await import(layout.path);
				layoutComponent = document.createElement(layout.component);
				root.appendChild(layoutComponent);
			}
			await layoutComponent.renderSlot(routeComponent.outerHTML);
		} else {
			root.innerHTML = "";
			root.appendChild(routeComponent);
		}
	} catch (e) {
		console.log("ERROR", e);
	}
};

const validDashboardPath = async (path) => {
	const userid = window.location.pathname
		.replace("/dashboard/", "")
		.replace(/\/+$/, "");
	if (!(await isAuth())) return false;
	const response = await fetchUserById(userid);
	if (response.data) return true;
	else {
		console.error(response.error);
		return false;
	}
};

window.onpopstate = handleLocation;
window.redirect = redirect;

handleLocation();
