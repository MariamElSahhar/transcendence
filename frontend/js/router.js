const routes = {
	404: { html: "/pages/404.html", script: null },
	"/": { html: "/pages/login.html", script: "/js/pages/login.js" },
	"/users": { html: "/pages/users.html", script: "/js/pages/users.js" },
	"/lorem": { html: "/pages/lorem.html", script: null },
	"/register": {
		html: "/pages/register.html",
		script: "/js/pages/register.js",
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
	const route = routes[path] || routes[404];
	const html = await fetch(route.html).then((data) => data.text());
	document.getElementById("root").innerHTML = html;
	if (route.script) {
		try {
			await new Promise((resolve, reject) => {
				const script = document.createElement("script");
				script.src = route.script;
				script.type = "module";
				script.onload = resolve;
				script.onerror = reject;
				document.body.appendChild(script);
			});
		} catch (error) {
			console.error(`Script ${route.script} failed to load`, error);
		}
	}
};

window.onpopstate = handleLocation;
window.route = route;
handleLocation();

export default redirect;
