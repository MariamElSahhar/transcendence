const BASE_URL = "http://127.0.0.1:8000/api";

export const login = async (credentials) => {
	try {
		const response = await fetch(`${BASE_URL}/login/`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});
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
		const response = await fetch(`${BASE_URL}/token/refresh/`, {
			method: "POST",
			credentials: "include",
		});

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
		const response = await fetch(`${BASE_URL}/register/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});
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
