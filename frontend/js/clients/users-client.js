const BASE_URL = "http://127.0.0.1:8000/api/users";

// Fetch all users
export const fetchUsers = async () => {
	try {
		const response = await fetch(`${BASE_URL}/`, {
			credentials: "include",
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to fetch users:", error);
		throw error;
	}
};

// Function user by ID
export const fetchUserById = async (id) => {
	try {
		const response = await fetch(`${BASE_URL}/${id}/`, {
			credentials: "include",
		});
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
		const response = await fetch(`${BASE_URL}/`, {
			credentials: "include",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});
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
		const response = await fetch(`${BASE_URL}/${id}/`, {
			credentials: "include",
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});
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
		const response = await fetch(`${BASE_URL}/${id}/`, {
			credentials: "include",
			method: "DELETE",
		});
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return true;
	} catch (error) {
		console.error("Failed to delete user:", error);
		throw error;
	}
};
