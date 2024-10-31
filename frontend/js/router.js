import { isAuth } from "./clients/token-client.js";

const routes = {
	"/home": {
		component: "home-page",
		path: "../pages/HomePage.js",
		protected: false,
	},
	"/": {
		component: "home-page",
		path: "../pages/HomePage.js",
		protected: false,
	},
	"/sign-in": {
		component: "sign-in-page",
		path: "../pages/SignInPage.js",
		protected: false,
	},
	"/sign-up": {
		component: "sign-up-page",
		path: "../pages/SignUpPage.js",
		protected: false,
	},
	404: {
		component: "not-found-page",
		path: "../pages/NotFound.js",
		protected: false,
	},
};

const redirect = (path) => {
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
