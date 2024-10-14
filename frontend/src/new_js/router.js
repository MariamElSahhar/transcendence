class Router {
	#routes;
	#rootElement;

	constructor(rootElement, routes = []) {
	  this.#routes = routes;  // Array to hold Route objects
	  this.#rootElement = rootElement;  // Root element to load the content
	  window.onpopstate = this.handleLocation.bind(this);  // Bind popstate event
	}

	// Add a new route dynamically
	addRoute(route) {
	  this.#routes.push(route);
	}

	// Handle navigation to a new route
	navigate(newPath) {
	  const { route, parameters } = this.#findMatchingRoute(newPath);
	  if (!route) {
		console.error(`Route ${newPath} not found`);
		return;
	  }
	  // Push new state to history
	  window.history.pushState({}, "", newPath);
	  this.loadRoute(route, parameters);  // Load the route
	}

	// Handle location changes (e.g., when using browser back/forward buttons)
	handleLocation() {
	  const path = window.location.pathname;
	  const { route, parameters } = this.#findMatchingRoute(path);
	  this.loadRoute(route, parameters);  // Load the appropriate route
	}

	// Load and replace the content of the root element with the route component
	async loadRoute(route, parameters) {
	  if (!route) {
		console.error("Route not found");
		return;
	  }
	  const customElement = document.createElement(route.component);
	  if (parameters) {
		Router.#setParametersInElement(customElement, route.pathParameters, parameters);
	  }
	  this.#rootElement.innerHTML = '';
	  this.#rootElement.appendChild(customElement);
	  // Load external resources (if any) for the route
	  if (route.script) {
		await this.loadScript(route.script);
	  }
	}

	// Load external script dynamically
	async loadScript(script) {
	  try {
		await new Promise((resolve, reject) => {
		  const scriptElement = document.createElement("script");
		  scriptElement.src = script;
		  scriptElement.type = "module";
		  scriptElement.onload = resolve;
		  scriptElement.onerror = reject;
		  document.body.appendChild(scriptElement);
		});
	  } catch (error) {
		console.error(`Script ${script} failed to load`, error);
	  }
	}

	// Find matching route for given path
	#findMatchingRoute(path) {
	  let parameters = null;
	  for (const route of this.#routes) {
		const matchedParams = path.match(route.pathRegex);
		if (matchedParams) {
		  parameters = matchedParams.slice(1);  // Remove the full match and get the params
		  return { route, parameters };
		}
	  }
	  return { route: null, parameters: [] };
	}

	static #setParametersInElement(element, parameters, values) {
	  for (let i = 0; i < parameters.length; i++) {
		element.setAttribute(parameters[i], values[i]);
	  }
	  return element;
	}

	init() {
	  this.handleLocation();  // Handle the initial location
	}
  }

  // Class representing a single route
  class Route {
	constructor(path, component, script = null) {
	  this.path = path;
	  this.component = component;
	  this.script = script;
	  this.#setPathRegex();
	}

	#setPathRegex() {
	  const parsedPath = this.path.replace(/:[a-zA-Z]+/g, '([a-zA-Z0-9-]+)');
	  this.pathRegex = new RegExp(`^${parsedPath}$`);
	}
  }

  // Initialize the app
  const rootElement = document.querySelector("#app");
  const router = new Router(rootElement);

  // Define your routes
  // Add the login and home_game routes to your router
  router.addRoute(new Route('/login', 'login-component'));
  router.addRoute(new Route('/home_game', 'home-game-component')); 
 
  router.addRoute(new Route('/local/', 'local-component'));
  router.addRoute(new Route('/multiplayer/', 'home-component'));
  router.addRoute(new Route('/tournaments/', 'tournaments-component'));
  router.addRoute(new Route('/tournaments/page/:pageId/', 'tournaments-component'));
  router.addRoute(new Route('/ranking/', 'ranking-component'));
  router.addRoute(new Route('/ranking/page/:pageId/', 'ranking-component'));
  router.addRoute(new Route('/signin/', 'signin-component'));
  router.addRoute(new Route('/signup/', 'signup-component'));
  router.addRoute(new Route('/reset-password/', 'reset-password-component'));
  router.addRoute(new Route('/account/active/:id/:token/', 'activate-account-component'));
  router.addRoute(new Route('/tournaments/create/', 'tournament-create-component'));
  router.addRoute(new Route('/profile/:username/', 'user-profile-component'));
  router.addRoute(new Route('/settings/', 'settings-component'));
  router.addRoute(new Route('/game/:port/', 'game-component'));
  router.addRoute(new Route('/privacy-policy/', 'privacy-policy-component'));
  router.addRoute(new Route('/home/', 'home-component'));
  router.addRoute(new Route('/', 'home-component'));
  router.addRoute(new Route('', 'notfound-component'));

  // Initialize router and make it globally accessible
  window.router = router;
  router.init();