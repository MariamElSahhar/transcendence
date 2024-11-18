import { isAuth } from "./utils/session-manager.js";

const routes = {
	"/": {
		component: "home-page",
		path: "../pages/home/HomePage.js",
		protected: false,
	},
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
	"/play-match": {
		component: "game-page",
		path: "../pages/local/GamePage.js",
		protected: false,
	},
	"/reset-password": {
		component: "reset-password-page",
		path: "../pages/reset_password/ResetPasswordPage.js",
		protected: false,
	},
	404: {
		component: "not-found-page",
		path: "../pages/error/NotFound.js",
		protected: false,
	},
};

export const redirect = (path) => {
	window.history.pushState({}, "", path);
	handleLocation();
};

const handleLocation = async () => {
	const path = window.location.pathname;
	let route = routes[path] || routes[404];
	const isProtected = route.protected;
	const root = document.getElementById("root");
	root.innerHTML = "";

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

window.onpopstate = handleLocation;
window.redirect = redirect;
handleLocation();
