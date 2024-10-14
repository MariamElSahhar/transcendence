const routes = {
	"/login": {
		component: "login-page",
		path: "../pages/LoginPage.js",
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
handleLocation();
