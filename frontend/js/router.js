import { isAuth, getUserSessionData } from "./utils/session-manager.js";
import { fetchUserById, usernameExist } from "./clients/users-client.js";

const routes = {
	// PUBLIC SCREENS
	"/": {
		component: "landing-page",
		path: "../pages/landing/LandingPage.js",
		protected: false,
	},
	"/sign-in": {
		component: "sign-in-page",
		path: "../pages/auth/SignInPage.js",
		protected: false,
	},
	"/sign-up": {
		component: "sign-up-page",
		path: "../pages/auth/SignUpPage.js",
		protected: false,
	},
	404: {
		component: "not-found-page",
		path: "../pages/error/NotFound.js",
		protected: false,
	},
	"/network-error": {
		component: "error-content",
		path: "../pages/utilities/Error.js",
		protected: false,
	},
	// PROTECTED SCREENS
	"/home": {
		layout: "main",
		component: "home-page",
		path: "../pages/home/HomePage.js",
		protected: false,
	},
	"/profile": {
		layout: "main",
		component: "user-profile-page",
		path: "../pages/profile/UserProfilePage.js",
		protected: false,
	},
	"/play-AI-match": {
		layout: "main",
		component: "AI-game-page",
		path: "../pages/AI/AIGamePage.js",
		protected: false,
	},
	"/play-match": {
		layout: "main",
		component: "game-page",
		path: "../pages/local/GamePage.js",
		protected: false,
	},
	"/friends": {
		layout: "main",
		component: "friends-page",
		path: "../pages/friends/FriendsPage.js",
		protected: false,
	},
	"/settings": {
		layout: "main",
		component: "settings-page",
		path: "../pages/settings/Settings.js",
		protected: false,
	},
	// test screen
	"/layout": {
		component: "main-layout",
		path: "../pages/layout/MainLayout.js",
		protected: false,
	},
	"/sidebar": {
		layout: "main",
		component: "sidebar-component",
		path: "../pages/layout/components/Sidebar.js",
		protected: false,
	},
};

const layouts = {
	main: {
		component: "main-layout",
		path: "../pages/layout/MainLayout.js",
	},
	sidebar: {
		component: "main-layout",
		path: "../pages/layout/MainLayout.js",
	},
};

export const redirect = (path) => {
	window.history.pushState({}, "", path);
	handleLocation();
};

const handleLocation = async () => {
	const path = window.location.pathname;
	let route;
	if (path.startsWith("/profile/")) {
		route = (await validProfilePath(window.location.pathname))
			? routes["/profile"]
			: routes[404];
	} else route = routes[path] || routes[404];

	const root = document.getElementById("root");
	root.innerHTML = "";

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
	await import(route.path);
	// layout
	if (layout) {
		// layout already active
		await import(layout.path);
		const layoutComponent = document.createElement(layout.component);
		const routeComponent = document.createElement(route.component);
		root.appendChild(layoutComponent);
		layoutComponent.renderSlot(routeComponent.outerHTML);
	}
	// no layout
	else {
		const element = document.createElement(route.component);
		root.appendChild(element);
	}
};

const validProfilePath = async (path) => {
	const userid = window.location.pathname
		.replace("/profile/", "")
		.replace(/\/+$/, "");
	const response = await fetchUserById(userid);
	if (response.data) return true;
	else {
		console.log(response.error);
		return false;
	}
};

window.onpopstate = handleLocation;
window.redirect = redirect;
handleLocation();
