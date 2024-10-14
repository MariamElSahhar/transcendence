const BASE_URL = "http://127.0.0.1:8000/api";

export const login = async (credentials) => {
	try {
		const url = `${BASE_URL}/login/`;
		reponse = HttpRequests.get(url, credentials);

		if (!response.ok) {
			throw new Error("Login failed: " + response.statusText);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error :", error);
		throw error;
	}
};

export const refreshAccessToken = async () => {
	try {
		const url = `${BASE_URL}/token/refresh/`;
		reponse = HttpRequests.get(url, credentials);

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
		reponse = HttpRequests.get(url, credentials);

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
