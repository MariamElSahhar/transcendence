const routes = {
	404: {
		component: "not-found-component",
		path: "../pages/NotFoundPage.js",
	},
	"/login": { component: "login-page", path: "../pages/LoginPage.js" },
	"/users": {
		component: "users-component",
		path: "../pages/UsersPage.js",
	},
	"/lorem": {
		component: "lorem-component",
		path: "../pages/LoremPage.js",
	},
	"/register": {
		component: "register-page",
		path: "../pages/RegisterPage.js",
	},
};

const route = (event) => {
	event = event || window.event;
	event.preventDefault();
	window.history.pushState({}, "", event.target.href);
	handleLocation();
};

const handleLocation = async () => {
	const path = window.location.pathname;
	const route = routes[path] || routes[404];
	const root = document.getElementById("root");
	root.innerHTML = "";

	if (route && route.importPath) {
		try {
			await import(route.importPath);
			const element = document.createElement(route.component);
			root.appendChild(element);
		} catch (error) {
			console.error(
				`Failed to load component at ${route.importPath}`,
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
handleLocation();
