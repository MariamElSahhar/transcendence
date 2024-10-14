const routes = {
	404: "not-found-component",
	"/login": "login-component",
	"/users": "users-component",
	"/lorem": "lorem-component",
	"/register": "register-component",
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
	const element = document.createElement(route.component);
	root.appendChild(element);
};

window.onpopstate = handleLocation;
window.route = route;
handleLocation();
