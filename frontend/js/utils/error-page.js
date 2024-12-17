// export class ErrorPage {
	const errorComponentName = 'error-component';
	const networkErrorMessage = 'Network error, ' +
	'please check your network connection.';
	const notFoundMessage = 'Page not found';

	//<navbar-component></navbar-component>
	const load = async(message, refresh = false) =>{
	await import('../../pages/components/Error.js');
	return (`
		<${errorComponentName}
			message="${message}"
			refresh="${refresh}">
		</${errorComponentName}>
		`);
};

const loadNetworkError = (event) =>{
	return(load(networkErrorMessage, true));
};

const loadNotFound = (event) =>{
	return(load(notFoundMessage, false));
};
//   }

window.load=load;
window.loadNetworkError=loadNetworkError;
window.loadNotFound=loadNotFound;