import { isAuth } from "./utils/session-manager.js";
import { usernameExist } from "./clients/users-client.js";

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
	},
	// PROTECTED SCREENS
	"/home": {
		component: "home-page",
		path: "../pages/home/HomePage.js",
		protected: false,
	},
	"/profile": {
		component: "user-profile-page",
		path: "../pages/profile/UserProfilePage.js",
		protected: false,
	},
	"/games": {
		component: "game-page",
		path: "../pages/local/GamePage.js",
		protected: false,
	},
	"/friends": {
		component: "friends-page",
		path: "../pages/friends/FriendsPage.js",
		protected: false,
	},
	"/reset-password": {
		component: "reset-password-page",
		path: "../pages/reset_password/ResetPasswordPage.js",
		protected: false,
	},
	"/settings": {
		component: "settings-page",
		path: "../pages/settings/Settings.js",
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
	if (isProtected) {
		const authenticated = await isAuth();
		if (!authenticated) route = routes[404];
	}
	try {
		await import(route.path);
		const element = document.createElement(route.component);
		root.appendChild(element);
	} catch (error) {
		console.error(`Failed to load component at ${route.path}`, error);
	}
};

const validProfilePath = async (path) => {
	const username = window.location.pathname
		.replace("/profile/", "")
		.replace(/\/+$/, "");
	const response = await usernameExist(username);
	if (response.success) return response.exists;
	else {
		// NOTE: HANDLE ERRORS
		console.log(response.error);
		return false;
	}
};

window.onpopstate = handleLocation;
window.redirect = redirect;
handleLocation();
