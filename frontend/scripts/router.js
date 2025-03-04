import { isAuth } from "./utils/session-manager.js";
import { fetchUserById } from "./clients/users-client.js";
window.APP_CONFIG = {
	// backendUrl: window.location.protocol=="https:" ? "": `http://${window.location.host}:8000`,
	// backendUrl: window.location.protocol=="https:" ? `https://${window.location.host}` : `http://${window.location.host}:8000`,
	mediaUrl: window.location.protocol=="https:" ? `https://${window.location.host}` :`http://${window.location.host}:8000`,
	backendUrl: window.location.protocol=="https:" ? `https://${window.location.host}` : `http://${window.location.host}:8000`,
	pointsToWinPongMatch: 1,
	gameCountdown: 3,
};

import {
	showError
} from "../pages/error/ErrorPage.js";


const routes = {
	// PUBLIC SCREENS
	"/": {
		layout: "auth",
		component: "landing-page",
		path: "../pages/LandingPage.js",
		protected: false,
		title: "Pong | Landing Page",
	},
	"/login": {
		layout: "auth",
		component: "login-page",
		path: "../pages/auth/LoginPage.js",
		protected: false,
		title: "Pong | Log In",
	},
	"/sign-up": {
		layout: "auth",
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
		layout: "main",
		component: "home-page",
		path: "../pages/HomePage.js",
		protected: true,
		title: "Pong | Homepage",
	},
	"/dashboard": {
		layout: "main",
		component: "dashboard-page",
		path: "../pages/dashboard/DashboardPage.js",
		protected: true,
		title: "Pong | My Dashboard",
	},
	"/play/single-player": {
		layout: "main",
		component: "local-game-page",
		path: "../pages/local-game/LocalGamePage.js",
		protected: true,
		title: "Pong | Single Player Game",
	},
	"/play/two-player": {
		layout: "main",
		component: "local-game-page",
		path: "../pages/local-game/LocalGamePage.js",
		protected: true,
		title: "Pong | Local Two Player Game",
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

const layouts = {
	auth: {
		component: "auth-layout",
		path: "../layouts/AuthLayout.js",
	},
	main: {
		component: "main-layout",
		path: "../layouts/MainLayout.js",
	},
	sidebar: {
		component: "sidebar-layout",
		path: "../layouts/SidebarLayout.js",
	},
};

window.icons = {
	mario: (flip) =>
		`<img src="/assets/sprites/mario.png" class="icon ${
			flip ? `flip-h` : ``
		}" alt="Mario">`,
	luigi: (flip) =>
		`<img src="/assets/sprites/luigi.png" class="icon ${
			flip ? `flip-h` : ``
		}" alt="Luigi">`,
	robot: (flip) =>
		`<img src="/assets/sprites/robot.png" class="icon ${
			flip ? `flip-h` : ``
		}" alt="Luigi">`,
	shroom: (flip) =>
		`<img src="/assets/sprites/8bit_shroom.png" class="icon ${
			flip ? `flip-h` : ``
		}" alt="Luigi">`,
	plant: (flip) =>
		`<img src="/assets/sprites/8bit_plant.png" class="icon ${
			flip ? `flip-h` : ``
		}" alt="Luigi">`,
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
	const layout = layouts[route.layout];
	loadRoute(route, layout);
};

window.onerror = function(message, source, lineno, colno, error) {
	console.error("Global error caught:", error);
	showError();
	return true;
  };

  window.addEventListener('unhandledrejection', function(event) {
	console.error("Unhandled promise rejection:", event.reason);
	import('../pages/error/ErrorPage.js')
	  .then(module => {
		const errorPage = document.createElement('error-page');
		document.getElementById('root').innerHTML = errorPage.render();
	  })
	  .catch(err => console.error("Error loading ErrorPage:", err));
  });

const loadRoute = async (route, layout) => {
	try {
		const root = document.getElementById("root");
		const routeComponent = document.createElement(route.component);
		await import(route.path);
		if (layout) {
			let layoutComponent = document.querySelector(layout.component);
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
	}  catch (e) {
		console.log("ERROR", e);
        showError();
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
