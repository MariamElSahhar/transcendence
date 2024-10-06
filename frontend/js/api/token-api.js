const BASE_URL = "http://127.0.0.1:8000/api";

export const login = async (credentials) => {
	try {
		const response = await fetch(`${BASE_URL}/token/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});
		if (!response.ok) {
			throw new Error("Login failed: " + response.statusText);
		}
		const data = await response.json();

		const accessToken = data.access;
		localStorage.setItem("access_token", accessToken);

		return data;
	} catch (error) {
		console.error("Error :", error);
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

		const accessToken = data.access;
		localStorage.setItem("access_token", accessToken);

		return data;
	} catch (error) {
		console.error("Error :", error);
		throw error;
	}
};
