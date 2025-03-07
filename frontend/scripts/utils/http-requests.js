// make an API request
const request = async (url, options) => {
	options.credentials = "include";
	try {
		url = window.APP_CONFIG.backendUrl + url;
		const response = await fetch(url, options);
		const body = response.status != 204 ? await response.json() : null;
		if (!response.ok) {
			return {
				status: response.status,
				body: null,
				error: body ? body.detail || body.error || body : null,
			};
		}
		return { status: response.status, body };
	} catch (error) {
		return {
			status: null,
			body: null,
			error: "Unknown error.",
		};
	}
};

// get request
export const get = async (url, headers = {}) => {
	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
	};
	const response = await request(url, options);
	return response;
};

// post request
export const post = async (url, body, headers = {}) => {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		body: JSON.stringify(body),
	};
	return await request(url, options);
};

// patch request
export const patch = async (url, body, headers = {}) => {
	const options = {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		body: JSON.stringify(body),
	};
	return await request(url, options);
};

// delete request
export const del = async (url, headers = {}) => {
	const options = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
	};
	return await request(url, options);
};
