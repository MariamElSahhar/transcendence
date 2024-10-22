const BASE_URL = "http://127.0.0.1:8000/api";
import { post, get } from "../utils/http-requests.js";

export const login = async ({ username, password }) => {
	const url = `${BASE_URL}/login/`;
	const requestBody = { username, password };

	// try sending request
	const { status, body: responseBody, error } = await post(url, requestBody);

	// if there's a fetch error
	if (error) return { success: false, error: error };

	// everything's fine - return data
	return { success: true };
};

export const refresh = async () => {
	const url = `${BASE_URL}/token/refresh/`;
	try {
		reponse = post(url);

		if (!response.ok) {
			throw new Error("Refresh failed: " + response.statusText);
		}

		const data = await response.json();
		console.log("Access token refreshed", data);

		return { success: true, data: responseBody };
	} catch (error) {
		console.error("Error refreshing token:", error);
		throw error;
	}
};

export const register = async (credentials) => {
	try {
		const url = `${BASE_URL}/register/`;
		reponse = get(url, credentials);

		if (!response.ok) {
			throw new Error("Registration failed: " + response.statusText);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error :", error);
		throw error;
	}
};
