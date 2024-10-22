const routes = {
	"/": {
		component: "home-page", // Home component will load HomeContent
		path: "../pages/HomePage.js", // Dynamically load the Home component
	},
	"/home": {
		component: "home-page", // Home component will load HomeContent
		path: "../pages/components/home/Home.js", // Dynamically load the Home component
	},
	"/login": {
		component: "login-page",
		path: "../pages/LoginPage.js",
	},
	"/register": {
		component: "register-page",
		path: "../pages/RegisterPage.js",
	},
	404: {
		component: "not-found-page", // Use a 404 fallback component
		path: "../pages/NotFound.js", // 404 not found component path
	},
};

const redirect = (path) => {
	window.history.pushState({}, "", path);
	handleLocation();
};

const route = (event) => {
	event = event || window.event;
	event.preventDefault();
	window.history.pushState({}, "", event.target.href);
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
