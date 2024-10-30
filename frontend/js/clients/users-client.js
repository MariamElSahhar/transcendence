const BASE_URL = "http://127.0.0.1:8000/api/users";
import { get, post, patch, del } from "../utils/http-requests.js";

// Fetch all users
export const fetchUsers = async () => {
	const { status, body, error } = await get(`${BASE_URL}/`);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data };
};

// Function user by ID
export const fetchUserById = async (id) => {
	const url = `${BASE_URL}/${id}/`;
	const { status, body, error } = get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data };
};

// Create user
export const createUser = async (userData) => {
	const url = `${BASE_URL}/${id}/`;
	const { status, body, error } = post(url, userData);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data };
};

// Update existing user by id
export const updateUser = async (id, userData) => {
	const url = `${BASE_URL}/${id}/`;
	const { status, body, error } = patch(url, userData);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data };
};

// Delete user
export const deleteUser = async (id) => {
	const url = `${BASE_URL}/${id}/`;
	const { status, body, error } = del(url, userData);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data };
};
