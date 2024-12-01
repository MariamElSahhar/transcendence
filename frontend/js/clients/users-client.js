const BASE_URL = "http://127.0.0.1:8000/api/users";
import { get, post, patch, del } from "../utils/http-requests.js";

const URIs = {
	users: `${BASE_URL}/`,
};

// Fetch all users
export const fetchUsers = async () => {
	const url = URIs.fetchUsers;
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data };
};

// Function user by ID
export const fetchUserById = async (id) => {
	const url = `${URIs.users}${id}/`;
	const { status, body, error } = get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data };
};

// Create user
export const createUser = async (userData) => {
	const url = `${URIs.users}${id}/`;
	const { status, body, error } = post(url, userData);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data };
};

// Update existing user by id
export const updateUser = async (id, userData) => {
	const url = `${URIs.users}${id}/`;
	const { status, body, error } = patch(url, userData);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data };
};

// Delete user
export const deleteUser = async (id) => {
	const url = `${URIs.users}${id}/`;
	const { status, body, error } = del(url, userData);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data };
};

export const usernameExist = async (username) => {
	// console.log(username.username)
	const url = `${URIs.users}username/${username.username}/exists/`;
	const { status, body, error } = await get(url);
	if (error) return { success: false, error: error };
	return { success: true, body };
};

export const emailExist = async (email) => {
	// console.log(email.email)
	const url = `${URIs.users}email/${email.email}/exists/`;
	const { status, body, error } = await get(url);
	if (error) return { success: false, error: error };
	return { success: true, body };
};

