const BASE_URL = "http://127.0.0.1:8000/api/users";
import { get, post, patch, del } from "../utils/http-requests.js";

// Fetch all users
export const fetchUsers = async () => {
	const { status, body, error } = await get(`${BASE_URL}/`);

	// if there's an error
	if (error) return { success: false, data: null, error: error };

	// everything's fine - return data
	return { success: true, data };
};

// Function user by ID
export const fetchUserById = async (id) => {
	try {
		const url = `${BASE_URL}/${id}/`;
		reponse = HttpRequests.get(url);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to fetch user:", error);
		throw error;
	}
};

// Create user
export const createUser = async (userData) => {
	try {
		const url = `${BASE_URL}/${id}/`;
		reponse = HttpRequests.get(url, userData);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to create user:", error);
		throw error;
	}
};

// Update existing user by id
export const updateUser = async (id, userData) => {
	try {
		const url = `${BASE_URL}/${id}/`;
		reponse = HttpRequests.get(url, userData);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to update user:", error);
		throw error;
	}
};

// Delete user
export const deleteUser = async (id) => {
	try {
		const url = `${BASE_URL}/${id}/`;
		reponse = HttpRequests.get(url, userData);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return true;
	} catch (error) {
		console.error("Failed to delete user:", error);
		throw error;
	}
};
