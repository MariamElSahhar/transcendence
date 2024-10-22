const BASE_URL = "http://127.0.0.1:8000/apii";
import { post, get } from "../utils/http-requests.js";

export const login = async ({ username, password }) => {
	const url = `${BASE_URL}/login/`;
	const requestBody = { username, password };
	try {
		const {
			response,
			body: responseBody,
			error,
		} = await post(url, requestBody);
		if (error) throw Error(error);
		if (!response.ok) {
			return {
				success: false,
				error:
					error.status == 401 ? "Incorrect logins" : "Login failed",
			};
		}
		return { success: true, data: responseBody };
	} catch (error) {
		return { success: false, error: "Network error occurred." };
	}
};

export const refresh = async () => {
	try {
		const url = `${BASE_URL}/token/refresh/`;
		reponse = get(url, credentials);

		if (!response.ok) {
			throw new Error("Refresh failed: " + response.statusText);
		}

		const data = await response.json();
		console.log("Access token refreshed", data);

		return data;
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
