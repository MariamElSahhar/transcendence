const routes = {
	"/": {
		component: "home-page",
		path: "../pages/HomePage.js",
	},
	"/home": {
		component: "home-page",
		path: "../pages/components/home/Home.js",
	},
	"/profile": {
		component: "user-profile-page",
		path: "../pages/UserProfilePage.js",
	},
	"/login": {
		component: "login-page",
		path: "../pages/LoginPage.js",
	},
	"/sign-in": {
		component: "sign-in-page",
		path: "../pages/SignInPage.js",
	},
	"/sign-up": {
		component: "sign-up-page",
		path: "../pages/SignUpPage.js",
	},
	"/reset-password": {  // New reset password route
		component: "reset-password-page",
		path: "../pages/ResetPasswordPage.js",
	},
	404: {
		component: "not-found-page",
		path: "../pages/NotFound.js",
	},
};

export const redirect = (path) => {
	window.history.pushState({}, "", path);
	handleLocation();
};

const route = (event, str) => {
	event = event || window.event;
	event.preventDefault();
	window.history.pushState({}, "", str);
	handleLocation();
};

const handleLocation = async () => {
	const path = window.location.pathname;
	const component = routes[path].component || routes[404].component;
	const componentPath = routes[path].path || routes[404].path;
	const root = document.getElementById("root");
	root.innerHTML = "";

	if (component && componentPath) {
		try {
			await import(componentPath);
			const element = document.createElement(component);
			root.appendChild(element);
		} catch (error) {
			console.error(
				`Failed to load component at ${componentPath}`,
				error
			);
		}
	} else {
		const element = document.createElement(route.component);
		root.appendChild(element);
	}
};

window.onpopstate = handleLocation;
window.route = route;
window.redirect = redirect;
handleLocation();
