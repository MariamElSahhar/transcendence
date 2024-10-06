const route = (event) => {
	event = event || window.event;
	event.preventDefault();
	window.history.pushState({}, "", event.target.href);
	handleLocation();
};

const routes = {
	404: { html: "/pages/404.html", script: null },
	"/": { html: "/pages/index.html", script: null },
	"/users": { html: "/pages/users.html", script: "/js/users.js" },
	"/lorem": { html: "/pages/lorem.html", script: null },
	"/register": { html: "/pages/register.html", script: null },
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
