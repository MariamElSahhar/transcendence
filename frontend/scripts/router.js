import { isAuth } from "./utils/session-manager.js";
import { fetchUserById } from "./clients/users-client.js";

const routes = {
	// PUBLIC SCREENS
	"/": {
		component: "landing-page",
		path: "../pages/LandingPage.js",
		protected: false,
	},
	"/login": {
		component: "login-page",
		path: "../pages/auth/LoginPage.js",
		protected: false,
	},
	"/sign-up": {
		component: "sign-up-page",
		path: "../pages/auth/SignUpPage.js",
		protected: false,
	},
	404: {
		component: "not-found-page",
		path: "../pages/error/NotFoundPage.js",
		protected: false,
	},
	// PROTECTED SCREENS
	"/home": {
		layout: "sidebar",
		component: "home-page",
		path: "../pages/HomePage.js",
		protected: false,
	},
	"/dashboard": {
		layout: "sidebar",
		component: "dashboard-page",
		path: "../pages/dashboard/DashboardPage.js",
		protected: false,
	},
	"/play/local": {
		layout: "main",
		component: "local-game-page",
		path: "../pages/local-game/LocalGamePage.js",
		protected: false,
	},
	"/play/remote": {
		layout: "main",
		component: "remote-game-page",
		path: "../pages/local/RemoteGamePage.js",
		protected: false,
	},
	"/play/tournament": {
		layout: "main",
		component: "tournament-page",
		path: "../pages/tournament/TournamentPage.js",
		protected: false,
	},
	"/friends": {
		layout: "main",
		component: "friends-page",
		path: "../pages/FriendsPage.js",
		protected: false,
	},
	"/settings": {
		layout: "main",
		component: "settings-page",
		path: "../pages/SettingsPage.js",
		protected: false,
	},
};

const layouts = {
	main: {
		component: "main-layout",
		path: "../pages/layouts/MainLayout.js",
	},
	sidebar: {
		component: "sidebar-layout",
		path: "../pages/layouts/SidebarLayout.js",
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
	// if (isProtected && !authenticated && route != routes[404]) {
	// 	route = routes[404];
	// } else if (!isProtected && authenticated && route != routes[404]) {
	// 	route = routes["/home"];
	// }
	const layout = layouts[route.layout];
	loadRoute(route, layout);
};

const loadRoute = async (route, layout) => {
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
};

const validDashboardPath = async (path) => {
	const userid = window.location.pathname
		.replace("/dashboard/", "")
		.replace(/\/+$/, "");
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
